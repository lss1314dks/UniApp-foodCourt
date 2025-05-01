if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$o = {
    name: "uniFormsItem",
    options: {
      virtualHost: true
    },
    provide() {
      return {
        uniFormItem: this
      };
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      }
    },
    props: {
      // 表单校验规则
      rules: {
        type: Array,
        default() {
          return null;
        }
      },
      // 表单域的属性名，在使用校验规则时必填
      name: {
        type: [String, Array],
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ""
      },
      // label的宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: ""
      },
      // 强制显示错误信息
      errorMessage: {
        type: [String, Boolean],
        default: ""
      },
      // 1.4.0 弃用，统一使用 form 的校验时机
      // validateTrigger: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 弃用，统一使用 form 的label 位置
      // labelPosition: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 以下属性已经废弃，请使用  #label 插槽代替
      leftIcon: String,
      iconColor: {
        type: String,
        default: "#606266"
      }
    },
    data() {
      return {
        errMsg: "",
        userRules: null,
        localLabelAlign: "left",
        localLabelWidth: "70px",
        localLabelPos: "left",
        border: false,
        isFirstBorder: false
      };
    },
    computed: {
      // 处理错误信息
      msg() {
        return this.errorMessage || this.errMsg;
      }
    },
    watch: {
      // 规则发生变化通知子组件更新
      "form.formRules"(val) {
        this.init();
      },
      "form.labelWidth"(val) {
        this.localLabelWidth = this._labelWidthUnit(val);
      },
      "form.labelPosition"(val) {
        this.localLabelPos = this._labelPosition();
      },
      "form.labelAlign"(val) {
      }
    },
    created() {
      this.init(true);
      if (this.name && this.form) {
        this.$watch(
          () => {
            const val = this.form._getDataValue(this.name, this.form.localData);
            return val;
          },
          (value, oldVal) => {
            const isEqual2 = this.form._isEqual(value, oldVal);
            if (!isEqual2) {
              const val = this.itemSetValue(value);
              this.onFieldChange(val, false);
            }
          },
          {
            immediate: false
          }
        );
      }
    },
    unmounted() {
      this.__isUnmounted = true;
      this.unInit();
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules = null) {
        this.userRules = rules;
        this.init(false);
      },
      // 兼容老版本表单组件
      setValue() {
      },
      /**
       * 外部调用方法
       * 校验数据
       * @param {any} value 需要校验的数据
       * @param {boolean} 是否立即校验
       * @return {Array|null} 校验内容
       */
      async onFieldChange(value, formtrigger = true) {
        const {
          formData,
          localData,
          errShowType,
          validateCheck,
          validateTrigger,
          _isRequiredField,
          _realName
        } = this.form;
        const name = _realName(this.name);
        if (!value) {
          value = this.form.formData[name];
        }
        const ruleLen = this.itemRules.rules && this.itemRules.rules.length;
        if (!this.validator || !ruleLen || ruleLen === 0)
          return;
        const isRequiredField2 = _isRequiredField(this.itemRules.rules || []);
        let result = null;
        if (validateTrigger === "bind" || formtrigger) {
          result = await this.validator.validateUpdate(
            {
              [name]: value
            },
            formData
          );
          if (!isRequiredField2 && (value === void 0 || value === "")) {
            result = null;
          }
          if (result && result.errorMessage) {
            if (errShowType === "undertext") {
              this.errMsg = !result ? "" : result.errorMessage;
            }
            if (errShowType === "toast") {
              uni.showToast({
                title: result.errorMessage || "校验错误",
                icon: "none"
              });
            }
            if (errShowType === "modal") {
              uni.showModal({
                title: "提示",
                content: result.errorMessage || "校验错误"
              });
            }
          } else {
            this.errMsg = "";
          }
          validateCheck(result ? result : null);
        } else {
          this.errMsg = "";
        }
        return result ? result : null;
      },
      /**
       * 初始组件数据
       */
      init(type = false) {
        const {
          validator,
          formRules,
          childrens,
          formData,
          localData,
          _realName,
          labelWidth,
          _getDataValue,
          _setDataValue
        } = this.form || {};
        this.localLabelAlign = this._justifyContent();
        this.localLabelWidth = this._labelWidthUnit(labelWidth);
        this.localLabelPos = this._labelPosition();
        this.form && type && childrens.push(this);
        if (!validator || !formRules)
          return;
        if (!this.form.isFirstBorder) {
          this.form.isFirstBorder = true;
          this.isFirstBorder = true;
        }
        if (this.group) {
          if (!this.group.isFirstBorder) {
            this.group.isFirstBorder = true;
            this.isFirstBorder = true;
          }
        }
        this.border = this.form.border;
        const name = _realName(this.name);
        const itemRule = this.userRules || this.rules;
        if (typeof formRules === "object" && itemRule) {
          formRules[name] = {
            rules: itemRule
          };
          validator.updateSchema(formRules);
        }
        const itemRules = formRules[name] || {};
        this.itemRules = itemRules;
        this.validator = validator;
        this.itemSetValue(_getDataValue(this.name, localData));
      },
      unInit() {
        if (this.form) {
          const {
            childrens,
            formData,
            _realName
          } = this.form;
          childrens.forEach((item, index) => {
            if (item === this) {
              this.form.childrens.splice(index, 1);
              delete formData[_realName(item.name)];
            }
          });
        }
      },
      // 设置item 的值
      itemSetValue(value) {
        const name = this.form._realName(this.name);
        const rules = this.itemRules.rules || [];
        const val = this.form._getValue(name, value, rules);
        this.form._setDataValue(name, this.form.formData, val);
        return val;
      },
      /**
       * 移除该表单项的校验结果
       */
      clearValidate() {
        this.errMsg = "";
      },
      // 是否显示星号
      _isRequired() {
        return this.required;
      },
      // 处理对齐方式
      _justifyContent() {
        if (this.form) {
          const {
            labelAlign
          } = this.form;
          let labelAli = this.labelAlign ? this.labelAlign : labelAlign;
          if (labelAli === "left")
            return "flex-start";
          if (labelAli === "center")
            return "center";
          if (labelAli === "right")
            return "flex-end";
        }
        return "flex-start";
      },
      // 处理 label宽度单位 ,继承父元素的值
      _labelWidthUnit(labelWidth) {
        return this.num2px(this.labelWidth ? this.labelWidth : labelWidth || (this.label ? 70 : "auto"));
      },
      // 处理 label 位置
      _labelPosition() {
        if (this.form)
          return this.form.labelPosition || "left";
        return "left";
      },
      /**
       * 触发时机
       * @param {Object} rule 当前规则内时机
       * @param {Object} itemRlue 当前组件时机
       * @param {Object} parentRule 父组件时机
       */
      isTrigger(rule, itemRlue, parentRule) {
        if (rule === "submit" || !rule) {
          if (rule === void 0) {
            if (itemRlue !== "bind") {
              if (!itemRlue) {
                return parentRule === "" ? "bind" : "submit";
              }
              return "submit";
            }
            return "bind";
          }
          return "submit";
        }
        return "bind";
      },
      num2px(num) {
        if (typeof num === "number") {
          return `${num}px`;
        }
        return num;
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-forms-item", ["is-direction-" + $data.localLabelPos, $data.border ? "uni-forms-item--border" : "", $data.border && $data.isFirstBorder ? "is-first-border" : ""]])
      },
      [
        vue.renderSlot(_ctx.$slots, "label", {}, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__label", { "no-label": !$props.label && !$props.required }]),
              style: vue.normalizeStyle({ width: $data.localLabelWidth, justifyContent: $data.localLabelAlign })
            },
            [
              $props.required ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "is-required"
              }, "*")) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($props.label),
                1
                /* TEXT */
              )
            ],
            6
            /* CLASS, STYLE */
          )
        ], true),
        vue.createElementVNode("view", { class: "uni-forms-item__content" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__error", { "msg--active": $options.msg }])
            },
            [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($options.msg),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__scopeId", "data-v-462874dd"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue"]]);
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  var pattern = {
    email: /^\S+?@\S+?\.\S+?$/,
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    url: new RegExp(
      "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
      "i"
    )
  };
  const FORMAT_MAPPING = {
    "int": "integer",
    "bool": "boolean",
    "double": "number",
    "long": "number",
    "password": "string"
    // "fileurls": 'array'
  };
  function formatMessage(args, resources = "") {
    var defaultMessage = ["label"];
    defaultMessage.forEach((item) => {
      if (args[item] === void 0) {
        args[item] = "";
      }
    });
    let str = resources;
    for (let key in args) {
      let reg = new RegExp("{" + key + "}");
      str = str.replace(reg, args[key]);
    }
    return str;
  }
  function isEmptyValue(value, type) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (typeof value === "string" && !value) {
      return true;
    }
    if (Array.isArray(value) && !value.length) {
      return true;
    }
    if (type === "object" && !Object.keys(value).length) {
      return true;
    }
    return false;
  }
  const types = {
    integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    string(value) {
      return typeof value === "string";
    },
    number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    "boolean": function(value) {
      return typeof value === "boolean";
    },
    "float": function(value) {
      return types.number(value) && !types.integer(value);
    },
    array(value) {
      return Array.isArray(value);
    },
    object(value) {
      return typeof value === "object" && !types.array(value);
    },
    date(value) {
      return value instanceof Date;
    },
    timestamp(value) {
      if (!this.integer(value) || Math.abs(value).toString().length > 16) {
        return false;
      }
      return true;
    },
    file(value) {
      return typeof value.url === "string";
    },
    email(value) {
      return typeof value === "string" && !!value.match(pattern.email) && value.length < 255;
    },
    url(value) {
      return typeof value === "string" && !!value.match(pattern.url);
    },
    pattern(reg, value) {
      try {
        return new RegExp(reg).test(value);
      } catch (e) {
        return false;
      }
    },
    method(value) {
      return typeof value === "function";
    },
    idcard(value) {
      return typeof value === "string" && !!value.match(pattern.idcard);
    },
    "url-https"(value) {
      return this.url(value) && value.startsWith("https://");
    },
    "url-scheme"(value) {
      return value.startsWith("://");
    },
    "url-web"(value) {
      return false;
    }
  };
  class RuleValidator {
    constructor(message) {
      this._message = message;
    }
    async validateRule(fieldKey, fieldValue, value, data, allData) {
      var result = null;
      let rules = fieldValue.rules;
      let hasRequired = rules.findIndex((item) => {
        return item.required;
      });
      if (hasRequired < 0) {
        if (value === null || value === void 0) {
          return result;
        }
        if (typeof value === "string" && !value.length) {
          return result;
        }
      }
      var message = this._message;
      if (rules === void 0) {
        return message["default"];
      }
      for (var i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let vt = this._getValidateType(rule);
        Object.assign(rule, {
          label: fieldValue.label || `["${fieldKey}"]`
        });
        if (RuleValidatorHelper[vt]) {
          result = RuleValidatorHelper[vt](rule, value, message);
          if (result != null) {
            break;
          }
        }
        if (rule.validateExpr) {
          let now = Date.now();
          let resultExpr = rule.validateExpr(value, allData, now);
          if (resultExpr === false) {
            result = this._getMessage(rule, rule.errorMessage || this._message["default"]);
            break;
          }
        }
        if (rule.validateFunction) {
          result = await this.validateFunction(rule, value, data, allData, vt);
          if (result !== null) {
            break;
          }
        }
      }
      if (result !== null) {
        result = message.TAG + result;
      }
      return result;
    }
    async validateFunction(rule, value, data, allData, vt) {
      let result = null;
      try {
        let callbackMessage = null;
        const res = await rule.validateFunction(rule, value, allData || data, (message) => {
          callbackMessage = message;
        });
        if (callbackMessage || typeof res === "string" && res || res === false) {
          result = this._getMessage(rule, callbackMessage || res, vt);
        }
      } catch (e) {
        result = this._getMessage(rule, e.message, vt);
      }
      return result;
    }
    _getMessage(rule, message, vt) {
      return formatMessage(rule, message || rule.errorMessage || this._message[vt] || message["default"]);
    }
    _getValidateType(rule) {
      var result = "";
      if (rule.required) {
        result = "required";
      } else if (rule.format) {
        result = "format";
      } else if (rule.arrayType) {
        result = "arrayTypeFormat";
      } else if (rule.range) {
        result = "range";
      } else if (rule.maximum !== void 0 || rule.minimum !== void 0) {
        result = "rangeNumber";
      } else if (rule.maxLength !== void 0 || rule.minLength !== void 0) {
        result = "rangeLength";
      } else if (rule.pattern) {
        result = "pattern";
      } else if (rule.validateFunction) {
        result = "validateFunction";
      }
      return result;
    }
  }
  const RuleValidatorHelper = {
    required(rule, value, message) {
      if (rule.required && isEmptyValue(value, rule.format || typeof value)) {
        return formatMessage(rule, rule.errorMessage || message.required);
      }
      return null;
    },
    range(rule, value, message) {
      const {
        range,
        errorMessage
      } = rule;
      let list = new Array(range.length);
      for (let i = 0; i < range.length; i++) {
        const item = range[i];
        if (types.object(item) && item.value !== void 0) {
          list[i] = item.value;
        } else {
          list[i] = item;
        }
      }
      let result = false;
      if (Array.isArray(value)) {
        result = new Set(value.concat(list)).size === list.length;
      } else {
        if (list.indexOf(value) > -1) {
          result = true;
        }
      }
      if (!result) {
        return formatMessage(rule, errorMessage || message["enum"]);
      }
      return null;
    },
    rangeNumber(rule, value, message) {
      if (!types.number(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let {
        minimum,
        maximum,
        exclusiveMinimum,
        exclusiveMaximum
      } = rule;
      let min = exclusiveMinimum ? value <= minimum : value < minimum;
      let max = exclusiveMaximum ? value >= maximum : value > maximum;
      if (minimum !== void 0 && min) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMinimum ? "exclusiveMinimum" : "minimum"]);
      } else if (maximum !== void 0 && max) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMaximum ? "exclusiveMaximum" : "maximum"]);
      } else if (minimum !== void 0 && maximum !== void 0 && (min || max)) {
        return formatMessage(rule, rule.errorMessage || message["number"].range);
      }
      return null;
    },
    rangeLength(rule, value, message) {
      if (!types.string(value) && !types.array(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let min = rule.minLength;
      let max = rule.maxLength;
      let val = value.length;
      if (min !== void 0 && val < min) {
        return formatMessage(rule, rule.errorMessage || message["length"].minLength);
      } else if (max !== void 0 && val > max) {
        return formatMessage(rule, rule.errorMessage || message["length"].maxLength);
      } else if (min !== void 0 && max !== void 0 && (val < min || val > max)) {
        return formatMessage(rule, rule.errorMessage || message["length"].range);
      }
      return null;
    },
    pattern(rule, value, message) {
      if (!types["pattern"](rule.pattern, value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      return null;
    },
    format(rule, value, message) {
      var customTypes = Object.keys(types);
      var format = FORMAT_MAPPING[rule.format] ? FORMAT_MAPPING[rule.format] : rule.format || rule.arrayType;
      if (customTypes.indexOf(format) > -1) {
        if (!types[format](value)) {
          return formatMessage(rule, rule.errorMessage || message.typeError);
        }
      }
      return null;
    },
    arrayTypeFormat(rule, value, message) {
      if (!Array.isArray(value)) {
        return formatMessage(rule, rule.errorMessage || message.typeError);
      }
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        let formatResult = this.format(rule, element, message);
        if (formatResult !== null) {
          return formatResult;
        }
      }
      return null;
    }
  };
  class SchemaValidator extends RuleValidator {
    constructor(schema, options) {
      super(SchemaValidator.message);
      this._schema = schema;
      this._options = options || null;
    }
    updateSchema(schema) {
      this._schema = schema;
    }
    async validate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async validateAll(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, true, allData);
      }
      return result;
    }
    async validateUpdate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidateUpdate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async invokeValidate(data, all, allData) {
      let result = [];
      let schema = this._schema;
      for (let key in schema) {
        let value = schema[key];
        let errorMessage = await this.validateRule(key, value, data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    async invokeValidateUpdate(data, all, allData) {
      let result = [];
      for (let key in data) {
        let errorMessage = await this.validateRule(key, this._schema[key], data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    _checkFieldInSchema(data) {
      var keys = Object.keys(data);
      var keys2 = Object.keys(this._schema);
      if (new Set(keys.concat(keys2)).size === keys2.length) {
        return "";
      }
      var noExistFields = keys.filter((key) => {
        return keys2.indexOf(key) < 0;
      });
      var errorMessage = formatMessage({
        field: JSON.stringify(noExistFields)
      }, SchemaValidator.message.TAG + SchemaValidator.message["defaultInvalid"]);
      return [{
        key: "invalid",
        errorMessage
      }];
    }
  }
  function Message() {
    return {
      TAG: "",
      default: "验证错误",
      defaultInvalid: "提交的字段{field}在数据库中并不存在",
      validateFunction: "验证无效",
      required: "{label}必填",
      "enum": "{label}超出范围",
      timestamp: "{label}格式无效",
      whitespace: "{label}不能为空",
      typeError: "{label}类型无效",
      date: {
        format: "{label}日期{value}格式无效",
        parse: "{label}日期无法解析,{value}无效",
        invalid: "{label}日期{value}无效"
      },
      length: {
        minLength: "{label}长度不能少于{minLength}",
        maxLength: "{label}长度不能超过{maxLength}",
        range: "{label}必须介于{minLength}和{maxLength}之间"
      },
      number: {
        minimum: "{label}不能小于{minimum}",
        maximum: "{label}不能大于{maximum}",
        exclusiveMinimum: "{label}不能小于等于{minimum}",
        exclusiveMaximum: "{label}不能大于等于{maximum}",
        range: "{label}必须介于{minimum}and{maximum}之间"
      },
      pattern: {
        mismatch: "{label}格式不匹配"
      }
    };
  }
  SchemaValidator.message = new Message();
  const deepCopy = (val) => {
    return JSON.parse(JSON.stringify(val));
  };
  const typeFilter = (format) => {
    return format === "int" || format === "double" || format === "number" || format === "timestamp";
  };
  const getValue = (key, value, rules) => {
    const isRuleNumType = rules.find((val) => val.format && typeFilter(val.format));
    const isRuleBoolType = rules.find((val) => val.format && val.format === "boolean" || val.format === "bool");
    if (!!isRuleNumType) {
      if (!value && value !== 0) {
        value = null;
      } else {
        value = isNumber(Number(value)) ? Number(value) : value;
      }
    }
    if (!!isRuleBoolType) {
      value = isBoolean(value) ? value : false;
    }
    return value;
  };
  const setDataValue = (field, formdata, value) => {
    formdata[field] = value;
    return value || "";
  };
  const getDataValue = (field, data) => {
    return objGet(data, field);
  };
  const realName = (name, data = {}) => {
    const base_name = _basePath(name);
    if (typeof base_name === "object" && Array.isArray(base_name) && base_name.length > 1) {
      const realname = base_name.reduce((a, b) => a += `#${b}`, "_formdata_");
      return realname;
    }
    return base_name[0] || name;
  };
  const isRealName = (name) => {
    const reg = /^_formdata_#*/;
    return reg.test(name);
  };
  const rawData = (object = {}, name) => {
    let newData = JSON.parse(JSON.stringify(object));
    let formData = {};
    for (let i in newData) {
      let path = name2arr(i);
      objSet(formData, path, newData[i]);
    }
    return formData;
  };
  const name2arr = (name) => {
    let field = name.replace("_formdata_#", "");
    field = field.split("#").map((v) => isNumber(v) ? Number(v) : v);
    return field;
  };
  const objSet = (object, path, value) => {
    if (typeof object !== "object")
      return object;
    _basePath(path).reduce((o, k, i, _) => {
      if (i === _.length - 1) {
        o[k] = value;
        return null;
      } else if (k in o) {
        return o[k];
      } else {
        o[k] = /^[0-9]{1,}$/.test(_[i + 1]) ? [] : {};
        return o[k];
      }
    }, object);
    return object;
  };
  function _basePath(path) {
    if (Array.isArray(path))
      return path;
    return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  const objGet = (object, path, defaultVal = "undefined") => {
    let newPath = _basePath(path);
    let val = newPath.reduce((o, k) => {
      return (o || {})[k];
    }, object);
    return !val || val !== void 0 ? val : defaultVal;
  };
  const isNumber = (num) => {
    return !isNaN(Number(num));
  };
  const isBoolean = (bool) => {
    return typeof bool === "boolean";
  };
  const isRequiredField = (rules) => {
    let isNoField = false;
    for (let i = 0; i < rules.length; i++) {
      const ruleData = rules[i];
      if (ruleData.required) {
        isNoField = true;
        break;
      }
    }
    return isNoField;
  };
  const isEqual = (a, b) => {
    if (a === b) {
      return a !== 0 || 1 / a === 1 / b;
    }
    if (a == null || b == null) {
      return a === b;
    }
    var classNameA = toString.call(a), classNameB = toString.call(b);
    if (classNameA !== classNameB) {
      return false;
    }
    switch (classNameA) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a === "" + b;
      case "[object Number]":
        if (+a !== +a) {
          return +b !== +b;
        }
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case "[object Date]":
      case "[object Boolean]":
        return +a === +b;
    }
    if (classNameA == "[object Object]") {
      var propsA = Object.getOwnPropertyNames(a), propsB = Object.getOwnPropertyNames(b);
      if (propsA.length != propsB.length) {
        return false;
      }
      for (var i = 0; i < propsA.length; i++) {
        var propName = propsA[i];
        if (a[propName] !== b[propName]) {
          return false;
        }
      }
      return true;
    }
    if (classNameA == "[object Array]") {
      if (a.toString() == b.toString()) {
        return true;
      }
      return false;
    }
  };
  const _sfc_main$n = {
    name: "uniForms",
    emits: ["validate", "submit"],
    options: {
      virtualHost: true
    },
    props: {
      // 即将弃用
      value: {
        type: Object,
        default() {
          return null;
        }
      },
      // vue3 替换 value 属性
      modelValue: {
        type: Object,
        default() {
          return null;
        }
      },
      // 1.4.0 开始将不支持 v-model ，且废弃 value 和 modelValue
      model: {
        type: Object,
        default() {
          return null;
        }
      },
      // 表单校验规则
      rules: {
        type: Object,
        default() {
          return {};
        }
      },
      //校验错误信息提示方式 默认 undertext 取值 [undertext|toast|modal]
      errShowType: {
        type: String,
        default: "undertext"
      },
      // 校验触发器方式 默认 bind 取值 [bind|submit]
      validateTrigger: {
        type: String,
        default: "submit"
      },
      // label 位置，默认 left 取值  top/left
      labelPosition: {
        type: String,
        default: "left"
      },
      // label 宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: "left"
      },
      border: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        uniForm: this
      };
    },
    data() {
      return {
        // 表单本地值的记录，不应该与传如的值进行关联
        formData: {},
        formRules: {}
      };
    },
    computed: {
      // 计算数据源变化的
      localData() {
        const localVal = this.model || this.modelValue || this.value;
        if (localVal) {
          return deepCopy(localVal);
        }
        return {};
      }
    },
    watch: {
      // 监听数据变化 ,暂时不使用，需要单独赋值
      // localData: {},
      // 监听规则变化
      rules: {
        handler: function(val, oldVal) {
          this.setRules(val);
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let getbinddata = getApp().$vm.$.appContext.config.globalProperties.binddata;
      if (!getbinddata) {
        getApp().$vm.$.appContext.config.globalProperties.binddata = function(name, value, formName) {
          if (formName) {
            this.$refs[formName].setValue(name, value);
          } else {
            let formVm;
            for (let i in this.$refs) {
              const vm = this.$refs[i];
              if (vm && vm.$options && vm.$options.name === "uniForms") {
                formVm = vm;
                break;
              }
            }
            if (!formVm)
              return formatAppLog("error", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:187", "当前 uni-froms 组件缺少 ref 属性");
            if (formVm.model)
              formVm.model[name] = value;
            if (formVm.modelValue)
              formVm.modelValue[name] = value;
            if (formVm.value)
              formVm.value[name] = value;
          }
        };
      }
      this.childrens = [];
      this.inputChildrens = [];
      this.setRules(this.rules);
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules) {
        this.formRules = Object.assign({}, this.formRules, rules);
        this.validator = new SchemaValidator(rules);
      },
      /**
       * 外部调用方法
       * 设置数据，用于设置表单数据，公开给用户使用 ， 不支持在动态表单中使用
       * @param {Object} key
       * @param {Object} value
       */
      setValue(key, value) {
        let example = this.childrens.find((child) => child.name === key);
        if (!example)
          return null;
        this.formData[key] = getValue(key, value, this.formRules[key] && this.formRules[key].rules || []);
        return example.onFieldChange(this.formData[key]);
      },
      /**
       * 外部调用方法
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      validate(keepitem, callback) {
        return this.checkAll(this.formData, keepitem, callback);
      },
      /**
       * 外部调用方法
       * 部分表单校验
       * @param {Array|String} props 需要校验的字段
       * @param {Function} 回调函数
       */
      validateField(props = [], callback) {
        props = [].concat(props);
        let invalidFields = {};
        this.childrens.forEach((item) => {
          const name = realName(item.name);
          if (props.indexOf(name) !== -1) {
            invalidFields = Object.assign({}, invalidFields, {
              [name]: this.formData[name]
            });
          }
        });
        return this.checkAll(invalidFields, [], callback);
      },
      /**
       * 外部调用方法
       * 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
       * @param {Array|String} props 需要移除校验的字段 ，不填为所有
       */
      clearValidate(props = []) {
        props = [].concat(props);
        this.childrens.forEach((item) => {
          if (props.length === 0) {
            item.errMsg = "";
          } else {
            const name = realName(item.name);
            if (props.indexOf(name) !== -1) {
              item.errMsg = "";
            }
          }
        });
      },
      /**
       * 外部调用方法 ，即将废弃
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      submit(keepitem, callback, type) {
        for (let i in this.dataValue) {
          const itemData = this.childrens.find((v) => v.name === i);
          if (itemData) {
            if (this.formData[i] === void 0) {
              this.formData[i] = this._getValue(i, this.dataValue[i]);
            }
          }
        }
        if (!type) {
          formatAppLog("warn", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:296", "submit 方法即将废弃，请使用validate方法代替！");
        }
        return this.checkAll(this.formData, keepitem, callback, "submit");
      },
      // 校验所有
      async checkAll(invalidFields, keepitem, callback, type) {
        if (!this.validator)
          return;
        let childrens = [];
        for (let i in invalidFields) {
          const item = this.childrens.find((v) => realName(v.name) === i);
          if (item) {
            childrens.push(item);
          }
        }
        if (!callback && typeof keepitem === "function") {
          callback = keepitem;
        }
        let promise;
        if (!callback && typeof callback !== "function" && Promise) {
          promise = new Promise((resolve, reject) => {
            callback = function(valid, invalidFields2) {
              !valid ? resolve(invalidFields2) : reject(valid);
            };
          });
        }
        let results = [];
        let tempFormData = JSON.parse(JSON.stringify(invalidFields));
        for (let i in childrens) {
          const child = childrens[i];
          let name = realName(child.name);
          const result = await child.onFieldChange(tempFormData[name]);
          if (result) {
            results.push(result);
            if (this.errShowType === "toast" || this.errShowType === "modal")
              break;
          }
        }
        if (Array.isArray(results)) {
          if (results.length === 0)
            results = null;
        }
        if (Array.isArray(keepitem)) {
          keepitem.forEach((v) => {
            let vName = realName(v);
            let value = getDataValue(v, this.localData);
            if (value !== void 0) {
              tempFormData[vName] = value;
            }
          });
        }
        if (type === "submit") {
          this.$emit("submit", {
            detail: {
              value: tempFormData,
              errors: results
            }
          });
        } else {
          this.$emit("validate", results);
        }
        let resetFormData = {};
        resetFormData = rawData(tempFormData, this.name);
        callback && typeof callback === "function" && callback(results, resetFormData);
        if (promise && callback) {
          return promise;
        } else {
          return null;
        }
      },
      /**
       * 返回validate事件
       * @param {Object} result
       */
      validateCheck(result) {
        this.$emit("validate", result);
      },
      _getValue: getValue,
      _isRequiredField: isRequiredField,
      _setDataValue: setDataValue,
      _getDataValue: getDataValue,
      _realName: realName,
      _isRealName: isRealName,
      _isEqual: isEqual
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-forms" }, [
      vue.createElementVNode("form", null, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_2$2 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__scopeId", "data-v-9a1e3c32"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-forms/components/uni-forms/uni-forms.vue"]]);
  const BASE_URL = "http://47.109.139.91:8081";
  function request(config = {}) {
    let {
      url,
      method = "GET",
      header = { "userToken": uni.getStorageSync("userToken") || "" },
      data = {}
    } = config;
    url = BASE_URL + url;
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method,
        header,
        data,
        success: (res) => {
          formatAppLog("log", "at utils/request.js:22", res);
          if (res.data.code === 200 || res.status == 200) {
            resolve(res.data);
          } else if (res.data.code === 400 || res.data.status == 0) {
            uni.showModal({
              title: "错误提示",
              content: res.data.msg,
              showCancel: false
            });
            reject(res.data);
          } else {
            uni.showToast({
              title: res.msg,
              icon: "none"
            });
            reject(res.data);
          }
        },
        fail: (err) => {
          formatAppLog("log", "at utils/request.js:41", "1111111");
          reject(err);
        }
      });
    });
  }
  function LoginApi(data) {
    return request({
      url: "/user/user/login",
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data
    });
  }
  function RegisterApi(data) {
    return request({
      url: "/user/user/register",
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data
    });
  }
  function getUserInfoApi() {
    return request({
      url: "/user/user/info",
      method: "get",
      header: {
        "userToken": uni.getStorageSync("userToken")
      }
    });
  }
  function getFoodInfoApi() {
    return request({
      url: "/suggest",
      method: "get",
      header: {
        "userToken": uni.getStorageSync("userToken")
      }
    });
  }
  function getDailyRecommendations(id) {
    return request({
      url: `/suggest/${id}`,
      method: "get",
      header: {
        "userToken": uni.getStorageSync("userToken")
      }
    });
  }
  function uploadUrl(img) {
    return request({
      url: "/admin/common/upload",
      method: "post",
      Header: {
        "userToken": uni.getStorageSync("userToken")
      },
      data: {
        "file": img
      }
    });
  }
  function EditUserApi(data) {
    return request({
      url: "/user/user",
      method: "put",
      data,
      header: {
        "userToken": uni.getStorageSync("userToken")
      }
    });
  }
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "Login",
    setup(__props, { expose: __expose }) {
      __expose();
      const formData = vue.reactive({
        username: "",
        password: ""
      });
      const login = async () => {
        const result = await LoginApi(formData);
        formatAppLog("log", "at pages/Login/Login.vue:60", "登录响应", result);
        if (result.code === 200) {
          uni.setStorageSync("userToken", result.data.token);
          formatAppLog("log", "at pages/Login/Login.vue:64", result.data.token);
          uni.setStorageSync("userInfo", result.data);
          formatAppLog("log", "at pages/Login/Login.vue:67", result.data);
          uni.setStorageSync("userId", result.data.id);
          uni.reLaunch({
            url: "/pages/index/index"
          });
          uni.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1e3
          });
        } else {
          uni.showToast({
            title: "登录失败,请重新输入用户名和密码",
            icon: "fail",
            duration: 1e3
          });
          formData.username = "";
          formData.password = "";
        }
      };
      const goRegister = () => {
        formatAppLog("log", "at pages/Login/Login.vue:94", "wenben");
        uni.reLaunch({
          url: "/pages/register/register"
        });
      };
      const __returned__ = { formData, login, goRegister };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1$3);
    const _component_uni_text = vue.resolveComponent("uni-text");
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "LoginLayout" }, [
      vue.createElementVNode("view", { class: "title" }, [
        vue.createElementVNode("text", null, "Welcome to FoodCourt")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "login-title" }, [
          vue.createElementVNode("text", {
            class: "text",
            style: { "padding-left": "50rpx" }
          }, "登录"),
          vue.createElementVNode("view", {
            class: "",
            style: { "width": "48px", "height": "5px", "background": "rgb(77, 190, 200)", "margin-top": "25rpx", "margin-left": "50rpx" }
          })
        ]),
        vue.createElementVNode("view", { class: "form" }, [
          vue.createVNode(_component_uni_forms, {
            class: "form-items",
            modelValue: $setup.formData,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData = $event)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_forms_item, { name: "username" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "用户名",
                      style: { "padding-left": "20rpx", "height": "80rpx" },
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.username = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.formData.username]
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, { name: "password" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "uni-input",
                      type: "safe-password",
                      placeholder: "密码",
                      style: { "padding-left": "20rpx", "height": "80rpx" },
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.password = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.formData.password]
                  ]),
                  vue.createCommentVNode(" uni-input ")
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createCommentVNode(" 注册按钮 "),
              vue.createVNode(_component_uni_forms_item, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_uni_text, {
                    onClick: $setup.goRegister,
                    style: { "float": "right", "color": "rgb(77, 190, 200)", "border-bottom": "1px solid rgb(77, 190, 200)", "font-size": "16px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("注册账户")
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, null, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("button", {
                    type: "primary",
                    style: { "background-color": "rgb(77, 190, 200)", "color": "#fff", "border-radius": "50rpx", "margin-top": "30rpx" },
                    onClick: $setup.login
                  }, "登录")
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createCommentVNode(" 注册按钮 ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__scopeId", "data-v-461d1d79"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/Login/Login.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$l = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__scopeId", "data-v-d31e1c47"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const _sfc_main$k = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      vue.onMounted(() => {
        getFoodInfo();
      });
      const refresh = () => {
        getFoodInfo();
      };
      const navigateToDetail = (id) => {
        uni.setStorageSync("foodId", id);
        uni.reLaunch({
          url: `/pages/DaytoDay/DaytoDay`
        });
      };
      const currentDate = vue.computed(() => {
        const now = /* @__PURE__ */ new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const week = ["日", "一", "二", "三", "四", "五", "六"][now.getDay()];
        return `${month}月${day}日 星期${week}`;
      });
      const carouselItems = vue.ref([
        {
          image: "https://food-court.oss-cn-hangzhou.aliyuncs.com/46.png",
          title: "健康饮食新主张",
          subtitle: "了解如何通过饮食提升免疫力"
        },
        {
          image: "https://food-court.oss-cn-hangzhou.aliyuncs.com/65.png",
          title: "食品安全指南",
          subtitle: "掌握食品安全基本知识"
        },
        {
          image: "https://food-court.oss-cn-hangzhou.aliyuncs.com/72.png",
          title: "营养搭配建议",
          subtitle: "均衡饮食的科学方法"
        }
      ]);
      const quickActions = vue.ref([
        {
          icon: "scan",
          iconColor: "#4CAF50",
          bgColor: "#C8E6C9",
          label: "扫码查询"
        },
        {
          icon: "paperplane",
          iconColor: "#8B5CF6",
          bgColor: "#EDE9FE",
          label: "运动计划"
        },
        {
          icon: "chat",
          iconColor: "#F97316",
          bgColor: "#FFEDD5",
          label: "AI助手"
        }
      ]);
      const formDataDailyRecommendations = vue.reactive([{
        id: 0,
        foodName: "",
        picture: "",
        desc: "",
        compose: "",
        benifit: "",
        protein: "",
        carbohydrate: "",
        fat: "",
        bmi: 22,
        disease: "无",
        age: 29,
        allergy: null,
        target: null,
        composeList: [],
        benifitList: [],
        kilo: 48
      }]);
      const getFoodInfo = async () => {
        const result = await getFoodInfoApi();
        if (result.code === 200) {
          Object.assign(formDataDailyRecommendations, result.data);
        } else {
          uni.showToast({
            title: "获取推荐列表失败",
            icon: "fail",
            duration: 1e3
          });
        }
      };
      const healthNews = vue.ref([
        {
          id: 1,
          image: "https://food-court.oss-cn-hangzhou.aliyuncs.com/87.png",
          title: "常见食品添加剂安全指南",
          subtitle: "了解哪些添加剂是安全的"
        },
        {
          id: 2,
          image: "https://food-court.oss-cn-hangzhou.aliyuncs.com/91.png",
          title: "有机食品真的更健康吗？",
          subtitle: "科学解析有机食品的优势"
        }
      ]);
      const getLocation = () => {
      };
      const handleQuickAction = (index) => {
        const actions = [
          "/pages/camera/camera",
          "/pages/playing/playing",
          "/pages/chating/chating"
        ];
        if (index == 0) {
          uni.navigateTo({
            url: actions[index]
          });
        } else {
          uni.reLaunch({
            url: actions[index]
          });
        }
      };
      const navigateTo2 = (url) => {
        uni.navigateTo({
          url
        });
      };
      onShow(() => {
      });
      const __returned__ = { refresh, navigateToDetail, currentDate, carouselItems, quickActions, formDataDailyRecommendations, getFoodInfo, healthNews, getLocation, handleQuickAction, navigateTo: navigateTo2, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, reactive: vue.reactive, get onShow() {
        return onShow;
      }, get getFoodInfoApi() {
        return getFoodInfoApi;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "home-container" }, [
      vue.createCommentVNode(" 顶部信息栏 - 毛玻璃透明版 "),
      vue.createElementVNode("view", { class: "top-bar" }, [
        vue.createElementVNode("view", { class: "top-bar-bg" }),
        vue.createCommentVNode(" 毛玻璃背景层 "),
        vue.createElementVNode("view", { class: "top-bar-content" }, [
          vue.createElementVNode("view", { class: "location-info" }, [
            vue.createVNode(_component_uni_icons, {
              type: "location-filled",
              size: "20",
              color: "#4CAF50"
            }),
            vue.createElementVNode("text", { class: "location-text" }, "重庆市")
          ]),
          vue.createCommentVNode(" 搜索栏 "),
          vue.createElementVNode("view", { class: "search-content" }),
          vue.createElementVNode("view", { class: "weather-info" }, [
            vue.createVNode(_component_uni_icons, {
              type: "partly-cloudy",
              size: "15",
              color: "#4CAF50"
            }),
            vue.createElementVNode("text", { class: "weather-text" }, "28°C 晴")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "content-container" }, [
        vue.createCommentVNode(" 轮播图 - 使用uni-swiper "),
        vue.createElementVNode("swiper", {
          class: "carousel",
          autoplay: true,
          interval: 3e3,
          circular: true
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.carouselItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                vue.createElementVNode("view", { class: "carousel-item" }, [
                  vue.createElementVNode("image", {
                    src: item.image,
                    mode: "aspectFill",
                    class: "carousel-image"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "carousel-overlay" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "carousel-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "carousel-subtitle" },
                      vue.toDisplayString(item.subtitle),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 快捷功能区 "),
        vue.createElementVNode("view", { class: "quick-actions" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.quickActions, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "quick-action-item",
                onClick: ($event) => $setup.handleQuickAction(index)
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "action-icon-container",
                    style: vue.normalizeStyle({ backgroundColor: item.bgColor })
                  },
                  [
                    vue.createVNode(_component_uni_icons, {
                      type: item.icon,
                      size: "24",
                      color: item.iconColor
                    }, null, 8, ["type", "color"])
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "action-label" },
                  vue.toDisplayString(item.label),
                  1
                  /* TEXT */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 每日推荐 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "每日推荐"),
            vue.createVNode(_component_uni_icons, {
              type: "loop",
              size: "20",
              color: "#4CAF50",
              onClick: $setup.refresh
            }),
            vue.createCommentVNode(` <text class="section-more" @click="navigateTo('/pages/recommend/index')"></text> `)
          ]),
          vue.createElementVNode("view", { class: "recommendation-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.formDataDailyRecommendations, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "recommendation-card",
                  onClick: ($event) => $setup.navigateToDetail(item.id)
                }, [
                  vue.createElementVNode("image", {
                    src: item.picture,
                    mode: "aspectFill",
                    class: "recommendation-image"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "recommendation-content" }, [
                    vue.createElementVNode("view", { class: "recommendation-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "recommendation-title" },
                        vue.toDisplayString(item.foodName),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "status-safe" }, "推荐")
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "recommendation-desc" },
                      vue.toDisplayString(item.desc),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "recommendation-meta" }, [
                      vue.createElementVNode("view", { class: "meta-item" }, [
                        vue.createVNode(_component_uni_icons, {
                          type: "fire-filled",
                          size: "14",
                          color: "#FB923C"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "meta-text" },
                          vue.toDisplayString(item.kilo + "千卡"),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "meta-item" }, [
                        vue.createVNode(_component_uni_icons, {
                          type: "clock-filled",
                          size: "14",
                          color: "#60A5FA"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "meta-text" },
                          vue.toDisplayString(),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createCommentVNode(" 健康资讯 "),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "健康资讯"),
            vue.createVNode(_component_uni_icons, {
              class: "section-more",
              type: "chat-filled",
              size: "20",
              color: "#4CAF50"
            }),
            vue.createCommentVNode(` <text class="section-more" @click="navigateTo('/pages/news/index')">{{"查看"}}</text>`)
          ]),
          vue.createElementVNode("view", { class: "news-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.healthNews, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "news-card",
                  onClick: ($event) => $setup.navigateTo(`/pages/news/detail?id=${item.id}`)
                }, [
                  vue.createElementVNode("image", {
                    src: item.image,
                    mode: "aspectFill",
                    class: "news-image"
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "text",
                    { class: "news-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "news-subtitle" },
                    vue.toDisplayString(item.subtitle),
                    1
                    /* TEXT */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/index/index.vue"]]);
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$j = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = {
          ...this.styles,
          "transition-duration": this.duration / 1e3 + "s"
        };
        let transform = "";
        for (let i in styles) {
          let line = this.toLine(i);
          transform += line + ":" + styles[i] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])), [
      [vue.vShow, $data.isShow]
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$i = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e) {
        e.stopPropagation();
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:310", "缺少类型：", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          this.showPoptrans();
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      showPoptrans() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.showTrans = true;
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0);
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]])
      },
      [
        vue.createElementVNode(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? (vue.openBlock(), vue.createBlock(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: vue.normalizeStyle($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* NEED_HYDRATION */
        )
      ],
      2
      /* CLASS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__scopeId", "data-v-4dd3c44b"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _sfc_main$h = {
    __name: "user",
    setup(__props, { expose: __expose }) {
      __expose();
      const userInfo = vue.reactive({
        id: 3,
        username: "",
        name: "",
        password: "",
        age: 0,
        phone: "",
        sex: 0,
        idNumber: "",
        avatar: "",
        status: "",
        tail: 0,
        weight: 0,
        allergy: "",
        disease: "",
        target: "",
        createTime: null,
        bim: 0
      });
      const accountInfo = vue.reactive({
        username: "zhang_xiaojian",
        phone: "138****5678",
        email: "xiaojian@example.com",
        registerTime: "2023-01-15"
      });
      const healthData = vue.reactive({
        height: 175,
        weight: 68,
        bmi: 22.2,
        bloodPressure: "120/80",
        allergies: "海鲜、花生",
        chronicDiseases: "无",
        healthGoal: "减重5kg"
      });
      const getUserInfo = async () => {
        const result = await getUserInfoApi();
        formatAppLog("log", "at pages/user/user.vue:266", result.data);
        if (result.code === 200) {
          Object.assign(userInfo, result.data);
          if (userInfo.weight && userInfo.tail) {
            const heightInMeters = userInfo.tail / 100;
            userInfo.bim = (userInfo.weight / (heightInMeters * heightInMeters)).toFixed(2);
          } else {
            userInfo.bim = 0;
          }
          formatAppLog("log", "at pages/user/user.vue:278", "计算后的BMI:", userInfo.bim);
        } else {
          uni.showToast({
            title: "请求失败",
            icon: "fail",
            duration: 1e3
          });
          userInfo = {};
        }
      };
      vue.onMounted(() => {
        getUserInfo();
      });
      const editProfileForm = vue.reactive({ ...accountInfo, bio: userInfo.bio });
      const editHealthDataForm = vue.reactive({
        height: healthData.height,
        weight: healthData.weight,
        systolic: 120,
        diastolic: 80,
        allergies: healthData.allergies,
        chronicDiseases: healthData.chronicDiseases,
        healthGoal: healthData.healthGoal
      });
      const settings = vue.reactive({
        notification: true,
        darkMode: false,
        language: 0
      });
      const chronicDiseasesOptions = vue.ref(["无", "高血压", "糖尿病", "心脏病", "其他"]);
      const healthGoalOptions = vue.ref(["减重5kg", "增肌", "改善睡眠", "控制血压", "均衡营养"]);
      const languageOptions = vue.ref(["简体中文", "English"]);
      const editProfileModal = vue.ref(null);
      const editHealthDataModal = vue.ref(null);
      const settingsModal = vue.ref(null);
      const onChronicDiseaseChange = (e) => {
        const index = e.detail.value;
        userInfo.disease = chronicDiseasesOptions.value[index];
      };
      const onHealthGoalChange = (e) => {
        const index = e.detail.value;
        userInfo.target = healthGoalOptions.value[index];
      };
      const showEditProfileModal = () => {
        editProfileModal.value.open();
      };
      const showEditHealthDataModal = () => {
        editHealthDataModal.value.open();
      };
      const showSettingsModal = () => {
        settingsModal.value.open();
      };
      const closeModal = () => {
        editProfileModal.value.close();
        editHealthDataModal.value.close();
        settingsModal.value.close();
      };
      const saveProfile = async () => {
        Object.assign(userInfo, userInfo);
        const result = await EditUserApi(userInfo);
        if (result.code === 200) {
          uni.showToast({ title: "个人资料已更新", icon: "success" });
          getUserInfo();
        }
        closeModal();
      };
      const saveHealthData = async () => {
        const result = await EditUserApi(userInfo);
        if (result.code === 200) {
          uni.showToast({ title: "个人资料已更新", icon: "success" });
          getUserInfo();
        }
        uni.showToast({ title: "健康数据已更新", icon: "success" });
        closeModal();
      };
      const editAvatar = () => {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            const filePath = res.tempFilePaths[0];
            uni.showLoading({
              title: "上传中..."
            });
            uni.uploadFile({
              url: "http://47.109.139.91:8081/admin/common/upload",
              header: {
                "userToken": uni.getStorageSync("userToken")
              },
              method: "post",
              filePath,
              name: "file",
              success: (uploadRes) => {
                uni.hideLoading();
                formatAppLog("log", "at pages/user/user.vue:409", "上传响应:", uploadRes);
                try {
                  const data = JSON.parse(uploadRes.data);
                  formatAppLog("log", "at pages/user/user.vue:415", "解析后的数据:", data);
                  if (data.code === 200 && data.data) {
                    userInfo.avatar = data.data;
                    uni.showToast({
                      title: "头像已更新",
                      icon: "success",
                      duration: 2e3
                    });
                  } else {
                    uni.showToast({
                      title: data.msg || "上传失败",
                      icon: "none",
                      duration: 2e3
                    });
                  }
                } catch (e) {
                  formatAppLog("error", "at pages/user/user.vue:437", "解析响应数据失败:", e);
                  uni.showToast({
                    title: "上传失败",
                    icon: "none",
                    duration: 2e3
                  });
                }
              },
              fail: (err) => {
                formatAppLog("error", "at pages/user/user.vue:446", "上传失败:", err);
                uni.hideLoading();
                uni.showToast({
                  title: "上传失败",
                  icon: "none",
                  duration: 2e3
                });
              }
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/user/user.vue:461", "选择图片失败:", err);
            uni.showToast({
              title: "选择图片失败",
              icon: "none"
            });
          }
        });
      };
      const toggleNotification = (e) => {
        settings.notification = e.detail.value;
        if (settings.notification === true)
          uni.showToast({
            title: "设置提醒成功",
            icon: "success"
          });
        else {
          uni.showToast({
            title: "取消提醒成功",
            icon: "success"
          });
        }
      };
      const toggleDarkMode = (e) => {
        settings.darkMode = e.detail.value;
      };
      const clearCache = () => {
        uni.showModal({
          title: "提示",
          content: "确定要清除缓存吗？",
          success: (res) => {
            if (res.confirm) {
              uni.clearStorageSync();
              uni.showToast({ title: "缓存已清除", icon: "success" });
            }
          }
        });
      };
      const aboutInfo = vue.ref({
        appName: "安食阁",
        version: "1.0.1",
        description: "一款专注于食品安全与健康的APP，帮助您了解食品成分，管理健康数据。",
        contact: "support@healthyfood.com",
        website: "www.ailissovhy.foodCourt.cn"
      });
      const showAboutUs = () => {
        uni.showModal({
          title: `关于 ${aboutInfo.value.appName}`,
          content: `
版本: ${aboutInfo.value.version}
    
${aboutInfo.value.description}
    
联系我们: ${aboutInfo.value.contact}
官网: ${aboutInfo.value.website}
    `,
          showCancel: false,
          confirmText: "我知道了"
        });
      };
      const showPrivacyPolicy = () => {
        uni.showModal({
          title: "隐私政策",
          content: "我们非常重视您的隐私。本应用收集的数据仅用于改善用户体验和提供个性化服务。我们不会将您的数据出售给第三方。",
          showCancel: false,
          confirmText: "我明白了"
        });
      };
      const logout = () => {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                uni.showLoading({
                  title: "正在退出...",
                  mask: true
                });
                uni.removeStorageSync("userToken");
                uni.removeStorageSync("userInfo");
                uni.reLaunch({
                  url: "/pages/Login/Login",
                  success: () => {
                    uni.showToast({
                      title: "退出成功",
                      icon: "success",
                      duration: 1500
                    });
                  },
                  fail: (err) => {
                    formatAppLog("error", "at pages/user/user.vue:575", "跳转登录页失败:", err);
                    uni.showToast({
                      title: "退出失败，请重试",
                      icon: "none"
                    });
                  }
                });
              } catch (error) {
                formatAppLog("error", "at pages/user/user.vue:584", "退出登录出错:", error);
                uni.showToast({
                  title: "退出失败",
                  icon: "none"
                });
              } finally {
                uni.hideLoading();
              }
            }
          }
        });
      };
      const __returned__ = { userInfo, accountInfo, healthData, getUserInfo, editProfileForm, editHealthDataForm, settings, chronicDiseasesOptions, healthGoalOptions, languageOptions, editProfileModal, editHealthDataModal, settingsModal, onChronicDiseaseChange, onHealthGoalChange, showEditProfileModal, showEditHealthDataModal, showSettingsModal, closeModal, saveProfile, saveHealthData, editAvatar, toggleNotification, toggleDarkMode, clearCache, aboutInfo, showAboutUs, showPrivacyPolicy, logout, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, get EditUserApi() {
        return EditUserApi;
      }, get getUserInfoApi() {
        return getUserInfoApi;
      }, get uploadUrl() {
        return uploadUrl;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "page-container" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "header-title" }, "个人中心")
      ]),
      vue.createCommentVNode(" 个人资料头部 "),
      vue.createElementVNode("view", { class: "profile-header" }, [
        vue.createElementVNode("view", { class: "avatar-container" }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: $setup.userInfo.avatar,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", {
            class: "edit-avatar",
            onClick: $setup.editAvatar
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "camera-filled",
              size: "16",
              color: "#4CAF50"
            })
          ])
        ]),
        vue.createElementVNode(
          "view",
          { class: "username" },
          vue.toDisplayString($setup.userInfo.name),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "settings-btn",
          onClick: $setup.showSettingsModal
        }, [
          vue.createVNode(_component_uni_icons, {
            type: "gear-filled",
            size: "20",
            color: "#fff"
          })
        ])
      ]),
      vue.createCommentVNode(" 账号信息 "),
      vue.createElementVNode("view", { class: "section-card" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "账号信息"),
          vue.createElementVNode("text", {
            class: "text-primary",
            onClick: $setup.showEditProfileModal
          }, "编辑")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("view", { class: "info-label" }, "用户名"),
            vue.createElementVNode(
              "view",
              { class: "info-value" },
              vue.toDisplayString($setup.userInfo.username),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("view", { class: "info-label" }, "手机号"),
            vue.createElementVNode(
              "view",
              { class: "info-value" },
              vue.toDisplayString($setup.userInfo.phone),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("view", { class: "info-label" }, "性别"),
            vue.createElementVNode(
              "view",
              { class: "info-value" },
              vue.toDisplayString($setup.userInfo.sex),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("view", { class: "info-label" }, "注册时间"),
            vue.createElementVNode(
              "view",
              { class: "info-value" },
              vue.toDisplayString($setup.userInfo.createTime),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 健康数据 "),
      vue.createElementVNode("view", { class: "section-card" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "健康数据"),
          vue.createElementVNode("text", {
            class: "text-primary",
            onClick: $setup.showEditHealthDataModal
          }, "编辑")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode("view", { class: "health-data-grid" }, [
            vue.createElementVNode("view", { class: "health-data-item" }, [
              vue.createElementVNode(
                "view",
                { class: "data-value" },
                vue.toDisplayString($setup.userInfo.tail),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "data-label" }, "身高 (cm)")
            ]),
            vue.createElementVNode("view", { class: "health-data-item" }, [
              vue.createElementVNode(
                "view",
                { class: "data-value" },
                vue.toDisplayString($setup.userInfo.weight),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "data-label" }, "体重 (kg)")
            ]),
            vue.createElementVNode("view", { class: "health-data-item" }, [
              vue.createElementVNode(
                "view",
                { class: "data-value" },
                vue.toDisplayString($setup.userInfo.bim),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "data-label" }, "BMI")
            ]),
            vue.createElementVNode("view", { class: "health-data-item" }, [
              vue.createElementVNode(
                "view",
                { class: "data-value" },
                vue.toDisplayString($setup.healthData.bloodPressure),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "data-label" }, "血压 (mmHg)")
            ])
          ]),
          vue.createElementVNode("view", { class: "mt-4" }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "info-label" }, "过敏源"),
              vue.createElementVNode(
                "view",
                { class: "info-value" },
                vue.toDisplayString($setup.userInfo.allergy),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "info-label" }, "慢性病史"),
              vue.createElementVNode(
                "view",
                { class: "info-value" },
                vue.toDisplayString($setup.userInfo.disease),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("view", { class: "info-label" }, "健康目标"),
              vue.createElementVNode(
                "view",
                { class: "info-value" },
                vue.toDisplayString($setup.userInfo.target),
                1
                /* TEXT */
              )
            ])
          ])
        ])
      ]),
      vue.createCommentVNode(" 编辑个人资料模态框 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "editProfileModal",
          type: "center",
          "mask-click": false
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "modal-content" }, [
              vue.createElementVNode("view", { class: "modal-header" }, [
                vue.createElementVNode("text", { class: "modal-title" }, "编辑个人资料"),
                vue.createVNode(_component_uni_icons, {
                  type: "closeempty",
                  size: "20",
                  onClick: $setup.closeModal
                })
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "用户名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.userInfo.username = $event),
                    type: "text"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.username]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "手机号"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.userInfo.phone = $event),
                    type: "tel"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.phone]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "性别"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.userInfo.sex = $event),
                    type: "tel"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.sex]
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  class: "btn-secondary",
                  onClick: $setup.closeModal
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "btn-primary",
                  onClick: $setup.saveProfile
                }, "保存")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 编辑健康数据模态框 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "editHealthDataModal",
          type: "center",
          "mask-click": false
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "modal-content" }, [
              vue.createElementVNode("view", { class: "modal-header" }, [
                vue.createElementVNode("text", { class: "modal-title" }, "编辑健康数据"),
                vue.createVNode(_component_uni_icons, {
                  type: "closeempty",
                  size: "20",
                  onClick: $setup.closeModal
                })
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "身高 (cm)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.userInfo.tail = $event),
                    type: "number"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.tail]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "体重 (kg)"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.userInfo.weight = $event),
                    type: "number"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.weight]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "过敏源"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "form-input",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.userInfo.allergy = $event),
                    type: "text"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.userInfo.allergy]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "慢性病史"),
                vue.createElementVNode("picker", {
                  class: "form-select",
                  range: $setup.chronicDiseasesOptions,
                  onChange: _cache[6] || (_cache[6] = (e) => $setup.onChronicDiseaseChange(e))
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($setup.userInfo.disease || "请选择"),
                    1
                    /* TEXT */
                  )
                ], 40, ["range"])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("label", { class: "form-label" }, "健康目标"),
                vue.createElementVNode("picker", {
                  class: "form-select",
                  range: $setup.healthGoalOptions,
                  onChange: _cache[7] || (_cache[7] = (e) => $setup.onHealthGoalChange(e))
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($setup.userInfo.target || "请选择"),
                    1
                    /* TEXT */
                  )
                ], 40, ["range"])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  class: "btn-secondary",
                  onClick: $setup.closeModal
                }, "取消"),
                vue.createElementVNode("button", {
                  class: "btn-primary",
                  onClick: $setup.saveHealthData
                }, "保存")
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 设置模态框 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "settingsModal",
          type: "bottom"
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "settings-modal" }, [
              vue.createElementVNode("view", { class: "modal-header" }, [
                vue.createElementVNode("text", { class: "modal-title" }, "设置"),
                vue.createVNode(_component_uni_icons, {
                  type: "closeempty",
                  size: "20",
                  onClick: $setup.closeModal
                })
              ]),
              vue.createElementVNode("view", { class: "settings-item" }, [
                vue.createElementVNode("view", { class: "settings-label" }, "通知提醒"),
                vue.createElementVNode("switch", {
                  checked: $setup.settings.notification,
                  onChange: $setup.toggleNotification,
                  color: "#4CAF50"
                }, null, 40, ["checked"])
              ]),
              vue.createElementVNode("view", {
                class: "settings-item",
                onClick: $setup.clearCache
              }, [
                vue.createElementVNode("view", { class: "settings-label" }, "清除缓存"),
                vue.createVNode(_component_uni_icons, {
                  type: "forward",
                  size: "16",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", {
                class: "settings-item",
                onClick: $setup.showAboutUs
              }, [
                vue.createElementVNode("view", { class: "settings-label" }, "关于我们"),
                vue.createVNode(_component_uni_icons, {
                  type: "forward",
                  size: "16",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("view", {
                class: "settings-item",
                onClick: $setup.showPrivacyPolicy
              }, [
                vue.createElementVNode("view", { class: "settings-label" }, "隐私政策"),
                vue.createVNode(_component_uni_icons, {
                  type: "forward",
                  size: "16",
                  color: "#999"
                })
              ]),
              vue.createElementVNode("button", {
                class: "logout-btn",
                onClick: $setup.logout
              }, "退出登录")
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/user/user.vue"]]);
  const _sfc_main$g = {
    __name: "hatPagec",
    props: {
      title: {
        type: String,
        default: "聊天对象"
      },
      selfAvatar: {
        type: String,
        default: "/static/images/avatar.jpg"
      },
      otherAvatar: {
        type: String,
        default: "/static/images/avatar.jpg"
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const getMessage = async (prompt) => {
        try {
          isTyping.value = true;
          const { data } = await uni.request({
            url: "http://47.109.139.91:8081/chat/context",
            // 修改为正确的后端地址
            method: "POST",
            data: { prompt },
            header: {
              "X-Session-ID": "123"
            }
          });
          if (data.success) {
            isTyping.value = false;
            chatMessages.value.push({ type: "other", content: data.data });
            scrollToBottom();
          } else {
            formatAppLog("error", "at components/hatPagec/hatPagec.vue:76", "聊天请求失败:", data.message);
          }
        } catch (error) {
          formatAppLog("error", "at components/hatPagec/hatPagec.vue:79", "请求出错:", error);
        }
      };
      const props = __props;
      const chatMessages = vue.ref([
        { type: "other", content: "你好呀！" }
      ]);
      const inputMessage = vue.ref("");
      const scrollTop = vue.ref(0);
      const safeAreaInsets = vue.ref(0);
      const tabbarHeight = vue.ref(50);
      const contentHeight = vue.ref(0);
      const isTyping = vue.ref(false);
      vue.onMounted(() => {
        initLayout();
      });
      function initLayout() {
        var _a;
        const systemInfo = uni.getSystemInfoSync();
        contentHeight.value = systemInfo.windowHeight - 44 - 60;
        safeAreaInsets.value = ((_a = systemInfo.safeAreaInsets) == null ? void 0 : _a.bottom) || 0;
        scrollToBottom();
      }
      function scrollToBottom() {
        vue.nextTick(() => {
          scrollTop.value = 999999;
        });
      }
      function sendMessage() {
        const msg = inputMessage.value.trim();
        if (msg) {
          chatMessages.value.push({ type: "self", content: msg });
          inputMessage.value = "";
          scrollToBottom();
          triggerVibrate();
          getMessage(msg);
        }
      }
      function triggerVibrate() {
        uni.vibrateShort({
          success: () => {
          },
          fail: () => {
          }
        });
      }
      function onInputFocus() {
        setTimeout(() => scrollToBottom(), 300);
      }
      function onInputBlur() {
        setTimeout(() => scrollToBottom(), 300);
      }
      function goBack() {
        uni.navigateBack();
      }
      const __returned__ = { getMessage, props, chatMessages, inputMessage, scrollTop, safeAreaInsets, tabbarHeight, contentHeight, isTyping, initLayout, scrollToBottom, sendMessage, triggerVibrate, onInputFocus, onInputBlur, goBack, ref: vue.ref, onMounted: vue.onMounted, nextTick: vue.nextTick, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-page" }, [
      vue.createCommentVNode(" 顶部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "ChatFoodCourt")
      ]),
      vue.createCommentVNode(" 聊天内容 "),
      vue.createElementVNode("scroll-view", {
        class: "chat-content",
        "scroll-y": "",
        "scroll-top": $setup.scrollTop,
        style: vue.normalizeStyle({ height: $setup.contentHeight + "px" })
      }, [
        vue.createElementVNode("view", { class: "message-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.chatMessages, (message, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "message-item"
              }, [
                message.type === "other" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "other-message"
                }, [
                  vue.createElementVNode("view", { class: "avatar-box" }, [
                    vue.createElementVNode("image", {
                      src: $props.otherAvatar,
                      class: "avatar"
                    }, null, 8, ["src"])
                  ]),
                  vue.createElementVNode("view", { class: "message-content other" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "message-text" },
                      vue.toDisplayString(message.content),
                      1
                      /* TEXT */
                    )
                  ])
                ])) : (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "self-message"
                }, [
                  vue.createElementVNode("view", { class: "message-content self" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "message-text" },
                      vue.toDisplayString(message.content),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "avatar-box" }, [
                    vue.createElementVNode("image", {
                      src: $props.selfAvatar,
                      class: "avatar"
                    }, null, 8, ["src"])
                  ])
                ]))
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          vue.createCommentVNode(" 正在输入中 "),
          $setup.isTyping ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "typing-tip"
          }, [
            vue.createElementVNode("text", null, "对方正在输入中...")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ], 12, ["scroll-top"]),
      vue.createElementVNode("view", { class: "input-area" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "input",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputMessage = $event),
            placeholder: "请输入消息",
            onConfirm: $setup.sendMessage,
            onFocus: $setup.onInputFocus,
            onBlur: $setup.onInputBlur
          },
          null,
          544
          /* NEED_HYDRATION, NEED_PATCH */
        ), [
          [vue.vModelText, $setup.inputMessage]
        ]),
        vue.createElementVNode("button", {
          class: "send-btn",
          onClick: $setup.sendMessage
        }, "发送")
      ])
    ]);
  }
  const ChatPage = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__scopeId", "data-v-0df2f20f"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/components/hatPagec/hatPagec.vue"]]);
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "chating",
    setup(__props, { expose: __expose }) {
      __expose();
      const avater = vue.ref("");
      vue.onMounted(async () => {
        const result = await getUserInfoApi();
        if (result.code === 200) {
          avater.value = result.data.avatar;
        } else {
          uni.showToast({
            title: "请求失败",
            icon: "fail",
            duration: 1e3
          });
          avater.value = "/static/images/avatar.jpg";
        }
      });
      const __returned__ = { avater, ChatPage };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createVNode($setup["ChatPage"], {
        title: "ChatFoodCustomer",
        selfAvatar: $setup.avater,
        otherAvatar: "https://food-court.oss-cn-hangzhou.aliyuncs.com/62.png"
      }, null, 8, ["selfAvatar"])
    ]);
  }
  const PagesChatingChating = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/chating/chating.vue"]]);
  const _sfc_main$e = {
    data() {
      return {
        currentIndex: 0,
        tabList: [
          {
            text: "首页",
            pagePath: "pages/index/index",
            iconPath: "/static/images/home.png",
            selectedIconPath: "/static/images/home-h.png"
          },
          {
            text: "聊天",
            pagePath: "pages/chating/chating",
            iconPath: "/static/images/classify.png",
            selectedIconPath: "/static/images/classify-h.png"
          },
          {
            text: "我的",
            pagePath: "pages/user/user",
            iconPath: "/static/images/user.png",
            selectedIconPath: "/static/images/user-h.png"
          }
        ]
      };
    },
    methods: {
      switchTab(index) {
        this.currentIndex = index;
        uni.switchTab({
          url: this.tabList[index].pagePath
        });
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "custom-tabbar" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.tabList, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: vue.normalizeClass($data.currentIndex === index ? "active" : ""),
            onClick: ($event) => $options.switchTab(index)
          }, [
            vue.createElementVNode("image", {
              src: $data.currentIndex === index ? item.selectedIconPath : item.iconPath
            }, null, 8, ["src"]),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(item.text),
              1
              /* TEXT */
            )
          ], 10, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createElementVNode("view", {
        class: "center-btn",
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.centerBtnClick && _ctx.centerBtnClick(...args))
      }, [
        vue.createElementVNode("image", { im: "" }),
        vue.createCommentVNode(" 这里的加号图标路径需根据实际情况修改 ")
      ])
    ]);
  }
  const PagesTabbarTabbar = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-2b029bdc"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/tabbar/tabbar.vue"]]);
  const _sfc_main$d = {};
  function _sfc_render$d(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", null, " 配料查看 ");
  }
  const PagesIngredientInfoIngredientInfo = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/IngredientInfo/IngredientInfo.vue"]]);
  const _sfc_main$c = {
    name: "UniBadge",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: "error"
      },
      inverted: {
        type: Boolean,
        default: false
      },
      isDot: {
        type: Boolean,
        default: false
      },
      maxNum: {
        type: Number,
        default: 99
      },
      absolute: {
        type: String,
        default: ""
      },
      offset: {
        type: Array,
        default() {
          return [0, 0];
        }
      },
      text: {
        type: [String, Number],
        default: ""
      },
      size: {
        type: String,
        default: "small"
      },
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {};
    },
    computed: {
      width() {
        return String(this.text).length * 8 + 12;
      },
      classNames() {
        const {
          inverted,
          type,
          size,
          absolute
        } = this;
        return [
          inverted ? "uni-badge--" + type + "-inverted" : "",
          "uni-badge--" + type,
          "uni-badge--" + size,
          absolute ? "uni-badge--absolute" : ""
        ].join(" ");
      },
      positionStyle() {
        if (!this.absolute)
          return {};
        let w = this.width / 2, h = 10;
        if (this.isDot) {
          w = 5;
          h = 5;
        }
        const x = `${-w + this.offset[0]}px`;
        const y = `${-h + this.offset[1]}px`;
        const whiteList = {
          rightTop: {
            right: x,
            top: y
          },
          rightBottom: {
            right: x,
            bottom: y
          },
          leftBottom: {
            left: x,
            bottom: y
          },
          leftTop: {
            left: x,
            top: y
          }
        };
        const match = whiteList[this.absolute];
        return match ? match : whiteList["rightTop"];
      },
      dotStyle() {
        if (!this.isDot)
          return {};
        return {
          width: "10px",
          minWidth: "0",
          height: "10px",
          padding: "0",
          borderRadius: "10px"
        };
      },
      displayValue() {
        const {
          isDot,
          text,
          maxNum
        } = this;
        return isDot ? "" : Number(text) > maxNum ? `${maxNum}+` : text;
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-badge--x" }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      $props.text ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: vue.normalizeClass([$options.classNames, "uni-badge"]),
          style: vue.normalizeStyle([$options.positionStyle, $props.customStyle, $options.dotStyle]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.onClick())
        },
        vue.toDisplayString($options.displayValue),
        7
        /* TEXT, CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-c97cb896"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-badge/components/uni-badge/uni-badge.vue"]]);
  const _sfc_main$b = {
    name: "UniListItem",
    emits: ["click", "switchChange"],
    props: {
      direction: {
        type: String,
        default: "row"
      },
      title: {
        type: String,
        default: ""
      },
      note: {
        type: String,
        default: ""
      },
      ellipsis: {
        type: [Number, String],
        default: 0
      },
      disabled: {
        type: [Boolean, String],
        default: false
      },
      clickable: {
        type: Boolean,
        default: false
      },
      showArrow: {
        type: [Boolean, String],
        default: false
      },
      link: {
        type: [Boolean, String],
        default: false
      },
      to: {
        type: String,
        default: ""
      },
      showBadge: {
        type: [Boolean, String],
        default: false
      },
      showSwitch: {
        type: [Boolean, String],
        default: false
      },
      switchChecked: {
        type: [Boolean, String],
        default: false
      },
      badgeText: {
        type: String,
        default: ""
      },
      badgeType: {
        type: String,
        default: "success"
      },
      badgeStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      rightText: {
        type: String,
        default: ""
      },
      thumb: {
        type: String,
        default: ""
      },
      thumbSize: {
        type: String,
        default: "base"
      },
      showExtraIcon: {
        type: [Boolean, String],
        default: false
      },
      extraIcon: {
        type: Object,
        default() {
          return {
            type: "",
            color: "#000000",
            size: 20,
            customPrefix: ""
          };
        }
      },
      border: {
        type: Boolean,
        default: true
      },
      customStyle: {
        type: Object,
        default() {
          return {
            padding: "",
            backgroundColor: "#FFFFFF"
          };
        }
      },
      keepScrollPosition: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      "customStyle.padding": {
        handler(padding) {
          if (typeof padding == "number") {
            padding += "";
          }
          let paddingArr = padding.split(" ");
          if (paddingArr.length === 1) {
            const allPadding = paddingArr[0];
            this.padding = {
              "top": allPadding,
              "right": allPadding,
              "bottom": allPadding,
              "left": allPadding
            };
          } else if (paddingArr.length === 2) {
            const [verticalPadding, horizontalPadding] = paddingArr;
            this.padding = {
              "top": verticalPadding,
              "right": horizontalPadding,
              "bottom": verticalPadding,
              "left": horizontalPadding
            };
          } else if (paddingArr.length === 4) {
            const [topPadding, rightPadding, bottomPadding, leftPadding] = paddingArr;
            this.padding = {
              "top": topPadding,
              "right": rightPadding,
              "bottom": bottomPadding,
              "left": leftPadding
            };
          }
        },
        immediate: true
      }
    },
    // inject: ['list'],
    data() {
      return {
        isFirstChild: false,
        padding: {
          top: "",
          right: "",
          bottom: "",
          left: ""
        }
      };
    },
    mounted() {
      this.list = this.getForm();
      if (this.list) {
        if (!this.list.firstChildAppend) {
          this.list.firstChildAppend = true;
          this.isFirstChild = true;
        }
      }
    },
    methods: {
      /**
       * 获取父元素实例
       */
      getForm(name = "uniList") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      },
      onClick() {
        if (this.to !== "") {
          this.openPage();
          return;
        }
        if (this.clickable || this.link) {
          this.$emit("click", {
            data: {}
          });
        }
      },
      onSwitchChange(e) {
        this.$emit("switchChange", e.detail);
      },
      openPage() {
        if (["navigateTo", "redirectTo", "reLaunch", "switchTab"].indexOf(this.link) !== -1) {
          this.pageApi(this.link);
        } else {
          this.pageApi("navigateTo");
        }
      },
      pageApi(api) {
        let callback = {
          url: this.to,
          success: (res) => {
            this.$emit("click", {
              data: res
            });
          },
          fail: (err) => {
            this.$emit("click", {
              data: err
            });
          }
        };
        switch (api) {
          case "navigateTo":
            uni.navigateTo(callback);
            break;
          case "redirectTo":
            uni.redirectTo(callback);
            break;
          case "reLaunch":
            uni.reLaunch(callback);
            break;
          case "switchTab":
            uni.switchTab(callback);
            break;
          default:
            uni.navigateTo(callback);
        }
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_badge = resolveEasycom(vue.resolveDynamicComponent("uni-badge"), __easycom_1$2);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass([{ "uni-list-item--disabled": $props.disabled }, "uni-list-item"]),
      style: vue.normalizeStyle({ "background-color": $props.customStyle.backgroundColor }),
      "hover-class": !$props.clickable && !$props.link || $props.disabled || $props.showSwitch ? "" : "uni-list-item--hover",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.isFirstChild ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["border--left", { "uni-list--border": $props.border }])
        },
        null,
        2
        /* CLASS */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["uni-list-item__container", { "container--right": $props.showArrow || $props.link, "flex--direction": $props.direction === "column" }]),
          style: vue.normalizeStyle({ paddingTop: $data.padding.top, paddingLeft: $data.padding.left, paddingRight: $data.padding.right, paddingBottom: $data.padding.bottom })
        },
        [
          vue.renderSlot(_ctx.$slots, "header", {}, () => [
            vue.createElementVNode("view", { class: "uni-list-item__header" }, [
              $props.thumb ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-list-item__icon"
              }, [
                vue.createElementVNode("image", {
                  src: $props.thumb,
                  class: vue.normalizeClass(["uni-list-item__icon-img", ["uni-list--" + $props.thumbSize]])
                }, null, 10, ["src"])
              ])) : $props.showExtraIcon ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "uni-list-item__icon"
              }, [
                vue.createVNode(_component_uni_icons, {
                  customPrefix: $props.extraIcon.customPrefix,
                  color: $props.extraIcon.color,
                  size: $props.extraIcon.size,
                  type: $props.extraIcon.type
                }, null, 8, ["customPrefix", "color", "size", "type"])
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ], true),
          vue.renderSlot(_ctx.$slots, "body", {}, () => [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["uni-list-item__content", { "uni-list-item__content--center": $props.thumb || $props.showExtraIcon || $props.showBadge || $props.showSwitch }])
              },
              [
                $props.title ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: vue.normalizeClass(["uni-list-item__content-title", [$props.ellipsis !== 0 && $props.ellipsis <= 2 ? "uni-ellipsis-" + $props.ellipsis : ""]])
                  },
                  vue.toDisplayString($props.title),
                  3
                  /* TEXT, CLASS */
                )) : vue.createCommentVNode("v-if", true),
                $props.note ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    class: "uni-list-item__content-note"
                  },
                  vue.toDisplayString($props.note),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ], true),
          vue.renderSlot(_ctx.$slots, "footer", {}, () => [
            $props.rightText || $props.showBadge || $props.showSwitch ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: vue.normalizeClass(["uni-list-item__extra", { "flex--justify": $props.direction === "column" }])
              },
              [
                $props.rightText ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "uni-list-item__extra-text"
                  },
                  vue.toDisplayString($props.rightText),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                $props.showBadge ? (vue.openBlock(), vue.createBlock(_component_uni_badge, {
                  key: 1,
                  type: $props.badgeType,
                  text: $props.badgeText,
                  "custom-style": $props.badgeStyle
                }, null, 8, ["type", "text", "custom-style"])) : vue.createCommentVNode("v-if", true),
                $props.showSwitch ? (vue.openBlock(), vue.createElementBlock("switch", {
                  key: 2,
                  disabled: $props.disabled,
                  checked: $props.switchChecked,
                  onChange: _cache[0] || (_cache[0] = (...args) => $options.onSwitchChange && $options.onSwitchChange(...args))
                }, null, 40, ["disabled", "checked"])) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )) : vue.createCommentVNode("v-if", true)
          ], true)
        ],
        6
        /* CLASS, STYLE */
      ),
      $props.showArrow || $props.link ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
        key: 1,
        size: 16,
        class: "uni-icon-wrapper",
        color: "#bbb",
        type: "arrowright"
      })) : vue.createCommentVNode("v-if", true)
    ], 14, ["hover-class"]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-c7524739"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue"]]);
  const _sfc_main$a = {
    name: "uniList",
    "mp-weixin": {
      options: {
        multipleSlots: false
      }
    },
    props: {
      stackFromEnd: {
        type: Boolean,
        default: false
      },
      enableBackToTop: {
        type: [Boolean, String],
        default: false
      },
      scrollY: {
        type: [Boolean, String],
        default: false
      },
      border: {
        type: Boolean,
        default: true
      },
      renderReverse: {
        type: Boolean,
        default: false
      }
    },
    // provide() {
    // 	return {
    // 		list: this
    // 	};
    // },
    created() {
      this.firstChildAppend = false;
    },
    methods: {
      loadMore(e) {
        this.$emit("scrolltolower");
      },
      scroll(e) {
        this.$emit("scroll", e);
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-list uni-border-top-bottom" }, [
      $props.border ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "uni-list--border-top"
      })) : vue.createCommentVNode("v-if", true),
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      $props.border ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "uni-list--border-bottom"
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-c2f1266a"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-list/components/uni-list/uni-list.vue"]]);
  const _imports_0$1 = "/static/images/user.png";
  const _sfc_main$9 = {
    __name: "about",
    setup(__props, { expose: __expose }) {
      __expose();
      vue.useCssVars((_ctx) => ({
        "13a78ac6-themeColor": themeColor.value
      }));
      const themeColor = vue.ref("#5A7EF7");
      const logoScale = vue.ref("scale(1)");
      const contactList = vue.reactive([
        {
          icon: "link",
          title: "官方网站",
          value: "https://www.example.com",
          action: () => openWebsite("https://www.example.com")
        },
        {
          icon: "phone",
          title: "客服电话",
          value: "400-123-4567",
          action: () => makePhoneCall("400-123-4567")
        },
        {
          icon: "weixin",
          title: "微信公众号",
          value: "ExampleApp"
        },
        {
          icon: "compose",
          title: "用户协议",
          action: () => navigateTo("/pages/agreement/user")
        },
        {
          icon: "locked",
          title: "隐私政策",
          action: () => navigateTo("/pages/agreement/privacy")
        }
      ]);
      const socialMedia = vue.reactive([
        { icon: "weixin", link: "#" },
        { icon: "weibo", link: "#" },
        { icon: "phone", link: "#" },
        { icon: "qq", link: "#" }
      ]);
      const handleAction = (item) => {
        if (item.action)
          item.action();
      };
      const __returned__ = { themeColor, logoScale, contactList, socialMedia, handleAction, ref: vue.ref, reactive: vue.reactive };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_list_item = resolveEasycom(vue.resolveDynamicComponent("uni-list-item"), __easycom_1$1);
    const _component_uni_list = resolveEasycom(vue.resolveDynamicComponent("uni-list"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 波浪背景 "),
      vue.createElementVNode("view", { class: "wave-bg" }, [
        (vue.openBlock(), vue.createElementBlock("svg", {
          viewBox: "0 0 500 150",
          preserveAspectRatio: "none"
        }, [
          vue.createElementVNode("path", {
            d: "M0,80 C150,180 350,0 500,80 L500,150 L0,150 Z",
            fill: "currentColor"
          })
        ]))
      ]),
      vue.createCommentVNode(" 头部信息 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode(
          "image",
          {
            class: "logo",
            src: _imports_0$1,
            mode: "aspectFit",
            style: vue.normalizeStyle({ transform: $setup.logoScale }),
            onTouchstart: _cache[0] || (_cache[0] = ($event) => $setup.logoScale = "scale(0.95)"),
            onTouchend: _cache[1] || (_cache[1] = ($event) => $setup.logoScale = "scale(1)")
          },
          null,
          36
          /* STYLE, NEED_HYDRATION */
        ),
        vue.createElementVNode("text", { class: "app-name" }, "安食阁"),
        vue.createElementVNode("text", { class: "slogan" }, "让食品健康更美好"),
        vue.createElementVNode("view", { class: "version-box" }, [
          vue.createElementVNode("text", { class: "version" }, "v1.0.0")
        ])
      ]),
      vue.createCommentVNode(" 信息卡片 "),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createVNode(_component_uni_list, { class: "info-list" }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.contactList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_uni_list_item, {
                  key: index,
                  title: item.title,
                  "show-arrow": item.action,
                  onClick: ($event) => $setup.handleAction(item)
                }, {
                  header: vue.withCtx(() => [
                    vue.createVNode(_component_uni_icons, {
                      type: item.icon,
                      size: "20",
                      color: $setup.themeColor,
                      class: "list-icon"
                    }, null, 8, ["type", "color"])
                  ]),
                  footer: vue.withCtx(() => [
                    vue.createElementVNode(
                      "text",
                      { class: "info-text" },
                      vue.toDisplayString(item.value),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["title", "show-arrow", "onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      vue.createCommentVNode(" 社交链接 "),
      vue.createElementVNode("view", { class: "social-links" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.socialMedia, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "social-item",
              onClick: ($event) => _ctx.openSocial(item.link)
            }, [
              vue.createVNode(_component_uni_icons, {
                type: item.icon,
                size: "28",
                color: $setup.themeColor
              }, null, 8, ["type", "color"])
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 版权信息 "),
      vue.createElementVNode("view", { class: "copyright" }, [
        vue.createElementVNode("text", { class: "copyright-text" }, "©2025 LiTUTU科技"),
        vue.createElementVNode("view", { class: "divider" }),
        vue.createElementVNode("text", { class: "copyright-text" }, "创造美好体验")
      ])
    ]);
  }
  const PagesAboutAbout = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-13a78ac6"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/about/about.vue"]]);
  const _sfc_main$8 = {
    __name: "DaytoDay",
    setup(__props, { expose: __expose }) {
      __expose();
      const ingredients = vue.ref([]);
      const benefits = vue.ref([
        { icon: "heart", name: "降低心血管疾病风险" },
        { icon: "person", name: "改善认知功能" },
        { icon: "fire", name: "促进新陈代谢" }
      ]);
      const formData = vue.ref({
        age: 31,
        allergy: null,
        benifit: "促进消化、抗氧化",
        benifitList: [],
        bmi: 22.6,
        carbohydrate: 22.8,
        compose: "碳水化合物 22.8g, 膳食纤维 2.9g, 维生素 E 0.46mg",
        composeList: [],
        desc: "可煮可烤的黄色谷物",
        disease: "无",
        fat: 1.2,
        foodName: "玉米",
        id: 36,
        kilo: 112,
        picture: "https://example.com/corn.jpg",
        protein: 4,
        target: null
      });
      onLoad((options) => {
      });
      const handleBack = () => {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      };
      const handleFavorite = () => {
        uni.showToast({
          title: "确定成功",
          icon: "success"
        });
        uni.reLaunch({
          url: "/pages/index/index"
        });
      };
      const handleStartCooking = () => {
      };
      const getInfo = async (id) => {
        try {
          const result = await getDailyRecommendations(id);
          if (result.code === 200) {
            formData.value = { ...formData.value, ...result.data };
            if (formData.value.composeList) {
              ingredients.value = formData.value.composeList.map((item) => ({
                icon: "circle",
                name: item
              }));
            }
            formatAppLog("log", "at pages/DaytoDay/DaytoDay.vue:171", "更新后的 ingredients:", ingredients.value);
          } else {
            throw new Error(result.message || "请求失败");
          }
        } catch (error) {
          uni.showToast({
            title: error.message,
            icon: "none",
            duration: 2e3
          });
        }
      };
      vue.onMounted(() => {
        const storedData = uni.getStorageSync("foodId");
        formatAppLog("log", "at pages/DaytoDay/DaytoDay.vue:188", "获取到的存储数据:", storedData);
        getInfo(storedData);
      });
      const __returned__ = { ingredients, benefits, formData, handleBack, handleFavorite, handleStartCooking, getInfo, ref: vue.ref, onMounted: vue.onMounted, get onLoad() {
        return onLoad;
      }, get getDailyRecommendations() {
        return getDailyRecommendations;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("button", {
            class: "back-button",
            onClick: $setup.handleBack
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "left",
              size: "20",
              color: "#4CAF50"
            })
          ])
        ]),
        vue.createElementVNode("view", {
          class: "item",
          style: {}
        }, [
          vue.createElementVNode("view", {
            class: "title",
            style: { "color": "#4CAF50", "font-weight": "600" }
          }, [
            vue.createElementVNode("text", null, "每日推荐")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "right",
          style: { "width": "50px" }
        })
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("text", { class: "food-title" }, [
          vue.createTextVNode(
            vue.toDisplayString($setup.formData.foodName) + " ",
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "badge" }, "推荐")
        ]),
        vue.createElementVNode("image", {
          class: "food-image",
          src: $setup.formData.picture,
          mode: "aspectFill"
        }, null, 8, ["src"]),
        vue.createElementVNode(
          "text",
          { class: "food-description" },
          vue.toDisplayString($setup.formData.desc),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "prep-time" }, [
          vue.createVNode(_component_uni_icons, {
            type: "time",
            size: "16",
            color: "#FF9800"
          }),
          vue.createCommentVNode(" <text>准备时间: 10分钟</text> ")
        ]),
        vue.createElementVNode("view", { class: "nutrition-info" }, [
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($setup.formData.kilo),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "nutrition-label" }, "千卡")
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($setup.formData.protein),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "nutrition-label" }, "蛋白质")
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($setup.formData.carbohydrate),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "nutrition-label" }, "碳水化合物")
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($setup.formData.fat),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "nutrition-label" }, "脂肪")
          ])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "主要食材"),
          vue.createElementVNode("view", { class: "list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.ingredients, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "list-item",
                  key: index
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "circle",
                    size: "16",
                    color: "#4CAF50"
                  }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("view", { class: "section-title" }, "健康益处"),
          vue.createElementVNode("view", { class: "list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.formData.benifitList, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "list-item",
                  key: index
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "circle",
                    size: "16",
                    color: "#4CAF50"
                  }),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "action-buttons" }, [
          vue.createElementVNode("button", {
            class: "secondary-button",
            onClick: $setup.handleFavorite
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "star",
              size: "16",
              color: "#4CAF50"
            }),
            vue.createElementVNode("text", null, "确定")
          ]),
          vue.createCommentVNode(' <button class="primary-button" @click="handleStartCooking">\n          <uni-icons type="spoon" size="16" color="#ffffff"></uni-icons>\n          <text>开始制作</text>\n        </button> ')
        ])
      ])
    ]);
  }
  const PagesDaytoDayDaytoDay = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/DaytoDay/DaytoDay.vue"]]);
  const _sfc_main$7 = {
    data() {
      return {
        url: ""
      };
    },
    onLoad(item) {
      this.url = item.url;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("web-view", { src: $data.url }, null, 8, ["src"]);
  }
  const PagesWebViewWebView = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/web-view/web-view.vue"]]);
  const _sfc_main$6 = {
    __name: "ResultView",
    props: {
      productData: {
        type: Object,
        required: true
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const suggest = vue.ref("");
      const ingTest = productData.ingredients_text;
      suggest.value = ingTest.value.split("\n")[1];
      formatAppLog("log", "at pages/ResultView/ResultView.vue:101", ingredientsList);
      const __returned__ = { suggest, ingTest, ref: vue.ref, computed: vue.computed, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "result-view" }, [
      vue.createCommentVNode(" 返回按钮 "),
      vue.createVNode(_component_uni_icons, {
        type: "arrowleft",
        size: "24",
        class: "back-icon",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("back"))
      }),
      vue.createCommentVNode(" 头部信息 "),
      vue.createElementVNode("view", { class: "result-header" }, [
        vue.createElementVNode("image", {
          src: $props.productData.image_url,
          class: "result-image",
          mode: "aspectFit"
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "header-info" }, [
          vue.createElementVNode(
            "text",
            { class: "result-title" },
            vue.toDisplayString($props.productData.product_name),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "brand-text" },
            vue.toDisplayString($props.productData.brands),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "category-text" },
            vue.toDisplayString($props.productData.categories),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 营养信息 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("text", { class: "card-title" }, "营养信息（每100g）"),
        vue.createElementVNode("view", { class: "nutrition-grid" }, [
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode("text", { class: "nutrition-label" }, "热量"),
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($props.productData.nutriments["energy-kcal"]) + "kcal",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode("text", { class: "nutrition-label" }, "蛋白质"),
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($props.productData.nutriments.proteins) + "g",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode("text", { class: "nutrition-label" }, "碳水"),
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($props.productData.nutriments.carbohydrates) + "g",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "nutrition-item" }, [
            vue.createElementVNode("text", { class: "nutrition-label" }, "脂肪"),
            vue.createElementVNode(
              "text",
              { class: "nutrition-value" },
              vue.toDisplayString($props.productData.nutriments.fat) + "g",
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 成分分析 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("text", { class: "card-title" }, "成分分析"),
        vue.createElementVNode("view", { class: "ingredient-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($props.productData.ingredients_text.split(";\n")[0].split("，"), (index, item) => {
              return vue.openBlock(), vue.createElementBlock("view", { class: "ingredient-item" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "circle-filled",
                  size: "12",
                  color: "#4CAF50",
                  class: "ingredient-icon"
                }),
                vue.createElementVNode(
                  "text",
                  { class: "ingredient-name" },
                  vue.toDisplayString(index),
                  1
                  /* TEXT */
                )
              ]);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createCommentVNode(" 成分分析 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("text", { class: "card-title" }, "建议"),
        vue.createElementVNode("view", { class: "ingredient-box" }, [
          vue.createElementVNode(
            "text",
            { class: "ingredient-text" },
            vue.toDisplayString($props.productData.ingredients_text.split("\n")[2] || $props.productData.ingredients_text.split("\n")[3]),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 过敏警告 "),
      $props.productData.allergens ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "warning-card"
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "info",
          size: "18",
          color: "#ff9800"
        }),
        vue.createElementVNode(
          "text",
          { class: "warning-text" },
          "过敏原警告：本产品包含 " + vue.toDisplayString($props.productData.allergens),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesResultViewResultView = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/ResultView/ResultView.vue"]]);
  const _sfc_main$5 = {
    __name: "camera",
    setup(__props, { expose: __expose }) {
      __expose();
      const scanning = vue.ref(false);
      const flashStatus = vue.ref("off");
      const showResult = vue.ref(false);
      const productData2 = vue.ref(null);
      const fetchProductData = async (barcode) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
        try {
          uni.showLoading({ title: "分析中..." });
          const { data: res } = await uni.request({
            url: `http://47.109.139.91:8081/api/food/${barcode}`,
            method: "GET",
            header: {
              "userToken": uni.getStorageSync("userToken")
            }
          });
          if (res.status != 1) {
            uni.showToast({
              title: "产品信息获取失败",
              icon: "none"
            });
            return;
          }
          const formatData = {
            product_name: ((_a = res.product.product_name) == null ? void 0 : _a.replace(/，/g, ", ")) || "未知产品",
            brands: ((_b = res.product.brands) == null ? void 0 : _b.split(", ")[0]) || "未知品牌",
            categories: ((_c = res.product.categories) == null ? void 0 : _c.split(", ")[0]) || "未分类",
            ingredients_text: ((_d = res.product.ingredients_text) == null ? void 0 : _d.replace(/;/g, ";\n")) || "无成分信息",
            allergens: ((_f = (_e = res.product.allergens) == null ? void 0 : _e.replace("en:", "")) == null ? void 0 : _f.split(",")[0]) || "无过敏原",
            nutriments: {
              "energy-kcal": ((_g = res.product.nutriments["energy-kcal"]) == null ? void 0 : _g.toFixed(1)) || 0,
              proteins: ((_h = res.product.nutriments.proteins) == null ? void 0 : _h.toFixed(1)) || 0,
              carbohydrates: ((_i = res.product.nutriments.carbohydrates) == null ? void 0 : _i.toFixed(1)) || 0,
              fat: ((_j = res.product.nutriments.fat) == null ? void 0 : _j.toFixed(1)) || 0,
              // 新增其他营养字段
              sugars: ((_k = res.product.nutriments.sugars) == null ? void 0 : _k.toFixed(1)) || 0,
              fiber: ((_l = res.product.nutriments.fiber) == null ? void 0 : _l.toFixed(1)) || 0,
              salt: ((_m = res.product.nutriments.salt) == null ? void 0 : _m.toFixed(1)) || 0
            },
            image_url: res.product.image_url || "/static/default-food.png"
          };
          productData2.value = formatData;
          showResult.value = true;
        } catch (error) {
          formatAppLog("error", "at pages/camera/camera.vue:119", "接口请求失败:", error);
          uni.showToast({
            title: error.errMsg || "请求失败，请检查网络",
            icon: "none"
          });
        } finally {
          uni.hideLoading();
        }
      };
      const startScan = async () => {
        scanning.value = true;
        try {
          uni.showLoading({
            title: "正在扫描...",
            mask: true
          });
          const res = await uni.scanCode({
            onlyFromCamera: true,
            scanType: ["barCode", "qrCode"],
            // 支持条形码和二维码
            success: (res2) => {
              uni.hideLoading();
              if (res2.result) {
                uni.showToast({
                  title: "扫描成功",
                  icon: "success",
                  duration: 1e3
                });
                fetchProductData(res2.result);
              } else {
                uni.showToast({
                  title: "未识别到有效条码",
                  icon: "none"
                });
              }
            },
            fail: (err) => {
              uni.hideLoading();
              let errMsg = "扫描失败";
              if (err.errMsg.includes("cancel")) {
                errMsg = "已取消扫描";
              } else if (err.errMsg.includes("camera")) {
                errMsg = "相机权限未授权";
              }
              uni.showToast({
                title: errMsg,
                icon: "none"
              });
            }
          });
        } catch (error) {
          uni.hideLoading();
          formatAppLog("error", "at pages/camera/camera.vue:175", "扫描异常:", error);
          uni.showToast({
            title: "扫描异常: " + (error.errMsg || "未知错误"),
            icon: "none"
          });
        } finally {
          scanning.value = false;
        }
      };
      const chooseImage = () => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            fetchProductData("3046920029759");
          },
          fail: (err) => {
            formatAppLog("error", "at pages/camera/camera.vue:194", "选择图片失败:", err);
          }
        });
      };
      onLoad(() => {
      });
      const handleBack = () => {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      };
      const __returned__ = { scanning, flashStatus, showResult, productData: productData2, fetchProductData, startScan, chooseImage, handleBack, ref: vue.ref, ResultView: PagesResultViewResultView, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "scan-container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("button", {
            class: "back-button",
            onClick: $setup.handleBack
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "left",
              size: "20",
              color: "#4CAF50"
            })
          ])
        ]),
        vue.createElementVNode("view", {
          class: "item",
          style: {}
        }, [
          vue.createElementVNode("view", {
            class: "title",
            style: { "color": "#4CAF50", "font-weight": "600" }
          }, [
            vue.createElementVNode("text", null, "扫码识别")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "right",
          style: { "width": "50px" }
        })
      ]),
      vue.createCommentVNode(" 扫描界面 "),
      !$setup.showResult ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createCommentVNode(" APP端扫描功能 "),
        vue.createElementVNode("view", { class: "camera-view" }, [
          vue.createCommentVNode(" 相机视图实现 "),
          vue.createElementVNode("view", { class: "camera-overlay" }, [
            vue.createElementVNode("view", { class: "scan-frame" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["scan-line", { "animate-scan": $setup.scanning }])
                },
                null,
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode("text", { class: "scan-tip" }, "将食品包装对准框内")
          ]),
          vue.createElementVNode("view", { class: "camera-controls" }, [
            vue.createElementVNode("view", {
              class: "camera-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.switchCamera && _ctx.switchCamera(...args))
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "reload",
                size: "24",
                color: "#fff"
              })
            ]),
            vue.createElementVNode("view", {
              class: "camera-btn capture",
              onClick: $setup.startScan
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "camera",
                size: "28",
                color: "#4CAF50"
              })
            ]),
            vue.createElementVNode("view", {
              class: "camera-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => _ctx.toggleFlash && _ctx.toggleFlash(...args))
            }, [
              vue.createVNode(_component_uni_icons, {
                type: $setup.flashStatus === "on" ? "bolt-filled" : "bolt",
                size: "24",
                color: "#fff"
              }, null, 8, ["type"])
            ])
          ])
        ]),
        vue.createCommentVNode(" H5端上传功能 ")
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 结果显示 "),
      $setup.showResult ? (vue.openBlock(), vue.createBlock($setup["ResultView"], {
        key: 1,
        productData: $setup.productData,
        onBack: _cache[2] || (_cache[2] = ($event) => $setup.showResult = false)
      }, null, 8, ["productData"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesCameraCamera = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/camera/camera.vue"]]);
  const _imports_0 = "/assets/playings.bf96cbfb.png";
  const _sfc_main$4 = {
    __name: "playing",
    setup(__props, { expose: __expose }) {
      __expose();
      const isExercising = vue.ref(false);
      const startTime = vue.ref(null);
      const elapsedTime = vue.ref(0);
      const timer = vue.ref(null);
      const steps = vue.ref(0);
      const distance = vue.ref("0.0");
      const calories = vue.ref(0);
      const stepGoal = vue.ref(1e4);
      const currentLocation = vue.ref("重庆市巴南区");
      const formattedSteps = vue.computed(() => Math.floor(steps.value).toLocaleString());
      const formattedTime = vue.computed(() => {
        const minutes = Math.floor(elapsedTime.value / 60);
        const seconds = elapsedTime.value % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      });
      const completedDays = vue.ref(2);
      const totalDays = vue.ref(5);
      const progress = vue.computed(() => Math.round(completedDays.value / totalDays.value * 100));
      const recentActivities = vue.ref([
        {
          type: "running",
          name: "快走",
          date: "昨天",
          duration: 30,
          calories: 120
        },
        {
          type: "running",
          name: "慢跑",
          date: "前天",
          duration: 20,
          calories: 180
        }
      ]);
      const toggleExercise = () => {
        if (isExercising.value) {
          clearInterval(timer.value);
          isExercising.value = false;
          recordActivity();
          uni.showToast({
            title: "运动已结束",
            icon: "success",
            duration: 1e3
          });
        } else {
          isExercising.value = true;
          startTime.value = /* @__PURE__ */ new Date();
          steps.value = 0;
          distance.value = "0.0";
          calories.value = 0;
          elapsedTime.value = 0;
          timer.value = setInterval(updateExerciseData, 1e3);
          uni.showToast({
            title: "运动已开始",
            icon: "success",
            duration: 1e3
          });
        }
      };
      const updateExerciseData = () => {
        if (!isExercising.value)
          return;
        elapsedTime.value = Math.floor((/* @__PURE__ */ new Date() - startTime.value) / 1e3);
        steps.value += 1.2;
        distance.value = (steps.value * 762e-6).toFixed(1);
        calories.value = Math.floor(70 * parseFloat(distance.value) * 1.036);
      };
      const recordActivity = () => {
        const newActivity = {
          type: "running",
          icon: "left",
          name: "步行",
          date: "今天",
          duration: Math.floor(elapsedTime.value / 60),
          calories: calories.value
        };
        recentActivities.value.unshift(newActivity);
        if (recentActivities.value.length > 5) {
          recentActivities.value.pop();
        }
        if (elapsedTime.value >= 1800) {
          completedDays.value = Math.min(completedDays.value + 1, totalDays.value);
        }
      };
      const getActivityIcon = (type) => {
        const icons = {
          walking: "footmark",
          running: "paperplane",
          cycling: "circle",
          swimming: "water"
        };
        return icons[type] || "help";
      };
      const locate = () => {
      };
      vue.onUnmounted(() => {
        if (timer.value)
          clearInterval(timer.value);
      });
      vue.onMounted(() => {
      });
      const __returned__ = { isExercising, startTime, elapsedTime, timer, steps, distance, calories, stepGoal, currentLocation, formattedSteps, formattedTime, completedDays, totalDays, progress, recentActivities, toggleExercise, updateExerciseData, recordActivity, getActivityIcon, locate, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, onUnmounted: vue.onUnmounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "运动计划")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createCommentVNode(" 地图区域 "),
        vue.createElementVNode("view", { class: "map-container" }, [
          vue.createElementVNode("view", { class: "map" }, [
            vue.createElementVNode("image", {
              src: _imports_0,
              mode: ""
            }),
            vue.createCommentVNode(" <MapContainer/> ")
          ]),
          vue.createElementVNode("view", {
            class: "map-gap",
            style: { "width": "100%", "height": "calc(300px - 123px)", "background-color": "white" }
          }),
          vue.createElementVNode("cover-view", { class: "map-overlay" }, [
            vue.createElementVNode("cover-view", { class: "flex justify-between items-center" }, [
              vue.createElementVNode("cover-view", null, [
                vue.createElementVNode("cover-view", { class: "text-sm opacity-80" }, "当前位置"),
                vue.createElementVNode(
                  "cover-view",
                  { class: "font-semibold" },
                  vue.toDisplayString($setup.currentLocation),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "cover-view",
                {
                  style: { "display": "flex", "align-items": "center", "text-align": "center", "justify-content": "center" },
                  class: "btn-primary text-sm py-2 px-4",
                  onClick: $setup.toggleExercise
                },
                vue.toDisplayString($setup.isExercising ? "结束运动" : "开始运动"),
                1
                /* TEXT */
              )
            ])
          ])
        ]),
        vue.createCommentVNode(" 计步器 "),
        vue.createElementVNode("view", { class: "pedometer" }, [
          vue.createElementVNode("view", { class: "pedometer-circle" }, [
            vue.createElementVNode(
              "view",
              { class: "steps-count" },
              vue.toDisplayString($setup.formattedSteps),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "steps-label" }, "步数")
          ]),
          vue.createElementVNode(
            "view",
            { class: "steps-goal" },
            "目标: " + vue.toDisplayString($setup.stepGoal.toLocaleString()) + "步",
            1
            /* TEXT */
          )
        ]),
        vue.createCommentVNode(" 统计数据 "),
        vue.createElementVNode("view", { class: "stats-container" }, [
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "view",
              { class: "stat-value" },
              vue.toDisplayString($setup.distance),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "stat-label" }, "公里")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "view",
              { class: "stat-value" },
              vue.toDisplayString($setup.calories),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "stat-label" }, "千卡")
          ]),
          vue.createElementVNode("view", { class: "stat-card" }, [
            vue.createElementVNode(
              "view",
              { class: "stat-value" },
              vue.toDisplayString($setup.formattedTime),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "stat-label" }, "时间")
          ])
        ]),
        vue.createCommentVNode(" 运动计划 "),
        vue.createElementVNode("view", { class: "plan-card" }, [
          vue.createElementVNode("view", { class: "plan-header" }, [
            vue.createElementVNode("view", { class: "plan-title" }, "每周运动计划"),
            vue.createElementVNode("view", { class: "tag tag-success" }, "进行中")
          ]),
          vue.createElementVNode("view", { class: "progress-container" }, [
            vue.createElementVNode(
              "view",
              {
                class: "progress-bar",
                style: vue.normalizeStyle({ width: $setup.progress + "%" })
              },
              null,
              4
              /* STYLE */
            )
          ]),
          vue.createElementVNode("view", { class: "progress-text" }, [
            vue.createElementVNode(
              "span",
              null,
              "已完成 " + vue.toDisplayString($setup.completedDays) + "/" + vue.toDisplayString($setup.totalDays) + " 天",
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "span",
              null,
              vue.toDisplayString($setup.progress) + "%",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "activity-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.recentActivities, (activity, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "activity-item",
                  key: index
                }, [
                  vue.createElementVNode("view", { class: "activity-icon" }, [
                    vue.createVNode(_component_uni_icons, {
                      type: $setup.getActivityIcon(activity.type),
                      size: "20",
                      color: "#4CAF50"
                    }, null, 8, ["type"])
                  ]),
                  vue.createElementVNode("view", { class: "activity-info" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "activity-name" },
                      vue.toDisplayString(activity.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "activity-meta" },
                      vue.toDisplayString(activity.date) + " · " + vue.toDisplayString(activity.duration) + "分钟",
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "activity-calories" },
                    vue.toDisplayString(activity.calories) + "千卡",
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ])
      ])
    ]);
  }
  const PagesPlayingPlaying = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/playing/playing.vue"]]);
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "register",
    setup(__props, { expose: __expose }) {
      __expose();
      const goBack = () => {
        uni.reLaunch({
          url: "/pages/Login/Login"
        });
      };
      const formData = vue.reactive({
        username: "",
        password: "",
        twopassword: ""
      });
      const register = async () => {
        formatAppLog("log", "at pages/register/register.vue:53", "1111111111111111111111111111");
        if (formData.password !== formData.twopassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "fail",
            duration: 1e3
          });
          return;
        }
        const result = await RegisterApi(formData);
        formatAppLog("log", "at pages/register/register.vue:63", "注册响应", result);
        if (result.code === 200) {
          uni.showToast({
            title: "注册成功",
            icon: "success",
            duration: 1e3
          });
          uni.reLaunch({
            url: "/pages/Login/Login"
          });
        } else {
          uni.showToast({
            title: "注册失败，请重新输入信息",
            icon: "fail",
            duration: 1e3
          });
          formData.username = "";
          formData.password = "";
          formData.twopassword = "";
        }
      };
      const __returned__ = { goBack, formData, register };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_1$3);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_2$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "RegistrationLayout" }, [
      vue.createElementVNode("view", {
        class: "back-btn",
        onClick: $setup.goBack
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "left",
          size: "24",
          color: "#fff"
        })
      ]),
      vue.createElementVNode("view", { class: "title" }, [
        vue.createElementVNode("text", null, "Welcome to FoodCourt")
      ]),
      vue.createElementVNode("view", { class: "content" }, [
        vue.createElementVNode("view", { class: "registration-title" }, [
          vue.createElementVNode("text", {
            class: "text",
            style: { "padding-left": "50rpx" }
          }, "注册"),
          vue.createElementVNode("view", {
            class: "",
            style: { "width": "48px", "height": "5px", "background": "rgb(77, 190, 200)", "margin-top": "25rpx", "margin-left": "50rpx" }
          })
        ]),
        vue.createElementVNode("view", { class: "form" }, [
          vue.createVNode(_component_uni_forms, {
            class: "form-items",
            modelValue: $setup.formData,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formData = $event)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_forms_item, { name: "username" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "用户名",
                      style: { "padding-left": "20rpx", "height": "80rpx" },
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formData.username = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.formData.username]
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, { name: "password" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "safe-password",
                      placeholder: "密码",
                      style: { "padding-left": "20rpx", "height": "80rpx" },
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formData.password = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.formData.password]
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, { name: "twopassword" }, {
                default: vue.withCtx(() => [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "safe-password",
                      placeholder: "确认密码",
                      style: { "padding-left": "20rpx", "height": "80rpx" },
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formData.twopassword = $event)
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.formData.twopassword]
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_forms_item, null, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("button", {
                    type: "primary",
                    style: { "background-color": "rgb(77, 190, 200)", "color": "#fff", "border-radius": "50rpx", "margin-top": "30rpx" },
                    onClick: $setup.register
                  }, "注册")
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ])
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-bac4a35d"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/register/register.vue"]]);
  const popup = {
    data() {
      return {};
    },
    created() {
      this.popup = this.getParent();
    },
    methods: {
      /**
       * 获取父元素实例
       */
      getParent(name = "uniPopup") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-popup.cancel": "cancel",
    "uni-popup.ok": "ok",
    "uni-popup.placeholder": "pleace enter",
    "uni-popup.title": "Hint",
    "uni-popup.shareTitle": "Share to"
  };
  const zhHans = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "确定",
    "uni-popup.placeholder": "请输入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const zhHant = {
    "uni-popup.cancel": "取消",
    "uni-popup.ok": "確定",
    "uni-popup.placeholder": "請輸入",
    "uni-popup.title": "提示",
    "uni-popup.shareTitle": "分享到"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$2 = {
    name: "uniPopupDialog",
    mixins: [popup],
    emits: ["confirm", "close", "update:modelValue", "input"],
    props: {
      inputType: {
        type: String,
        default: "text"
      },
      showClose: {
        type: Boolean,
        default: true
      },
      modelValue: {
        type: [Number, String],
        default: ""
      },
      placeholder: {
        type: [String, Number],
        default: ""
      },
      type: {
        type: String,
        default: "error"
      },
      mode: {
        type: String,
        default: "base"
      },
      title: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      beforeClose: {
        type: Boolean,
        default: false
      },
      cancelText: {
        type: String,
        default: ""
      },
      confirmText: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number,
        default: -1
      },
      focus: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dialogType: "error",
        val: ""
      };
    },
    computed: {
      okText() {
        return this.confirmText || t("uni-popup.ok");
      },
      closeText() {
        return this.cancelText || t("uni-popup.cancel");
      },
      placeholderText() {
        return this.placeholder || t("uni-popup.placeholder");
      },
      titleText() {
        return this.title || t("uni-popup.title");
      }
    },
    watch: {
      type(val) {
        this.dialogType = val;
      },
      mode(val) {
        if (val === "input") {
          this.dialogType = "info";
        }
      },
      value(val) {
        if (this.maxlength != -1 && this.mode === "input") {
          this.val = val.slice(0, this.maxlength);
        } else {
          this.val = val;
        }
      },
      val(val) {
        this.$emit("update:modelValue", val);
      }
    },
    created() {
      this.popup.disableMask();
      if (this.mode === "input") {
        this.dialogType = "info";
        this.val = this.value;
        this.val = this.modelValue;
      } else {
        this.dialogType = this.type;
      }
    },
    methods: {
      /**
       * 点击确认按钮
       */
      onOk() {
        if (this.mode === "input") {
          this.$emit("confirm", this.val);
        } else {
          this.$emit("confirm");
        }
        if (this.beforeClose)
          return;
        this.popup.close();
      },
      /**
       * 点击取消按钮
       */
      closeDialog() {
        this.$emit("close");
        if (this.beforeClose)
          return;
        this.popup.close();
      },
      close() {
        this.popup.close();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-popup-dialog" }, [
      vue.createElementVNode("view", { class: "uni-dialog-title" }, [
        vue.createElementVNode(
          "text",
          {
            class: vue.normalizeClass(["uni-dialog-title-text", ["uni-popup__" + $data.dialogType]])
          },
          vue.toDisplayString($options.titleText),
          3
          /* TEXT, CLASS */
        )
      ]),
      $props.mode === "base" ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "uni-dialog-content"
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode(
            "text",
            { class: "uni-dialog-content-text" },
            vue.toDisplayString($props.content),
            1
            /* TEXT */
          )
        ], true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "uni-dialog-content"
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.withDirectives(vue.createElementVNode("input", {
            class: "uni-dialog-input",
            maxlength: $props.maxlength,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.val = $event),
            type: $props.inputType,
            placeholder: $options.placeholderText,
            focus: $props.focus
          }, null, 8, ["maxlength", "type", "placeholder", "focus"]), [
            [vue.vModelDynamic, $data.val]
          ])
        ], true)
      ])),
      vue.createElementVNode("view", { class: "uni-dialog-button-group" }, [
        $props.showClose ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-dialog-button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.closeDialog && $options.closeDialog(...args))
        }, [
          vue.createElementVNode(
            "text",
            { class: "uni-dialog-button-text" },
            vue.toDisplayString($options.closeText),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-dialog-button", $props.showClose ? "uni-border-left" : ""]),
            onClick: _cache[2] || (_cache[2] = (...args) => $options.onOk && $options.onOk(...args))
          },
          [
            vue.createElementVNode(
              "text",
              { class: "uni-dialog-button-text uni-button-color" },
              vue.toDisplayString($options.okText),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-d78c88b7"], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue"]]);
  const _sfc_main$1 = {
    __name: "Food",
    setup(__props, { expose: __expose }) {
      __expose();
      const goBack = () => {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      };
      const foodList = vue.ref([
        {
          name: "地中海沙拉",
          recommended: true,
          description: "富含抗氧化物质，有助于心血管健康",
          calories: 320,
          time: 15
        },
        {
          name: "蓝莓燕麦粥",
          recommended: true,
          description: "富含膳食纤维，有助于肠道健康",
          calories: 280,
          time: 10
        },
        {
          name: "烤三文鱼",
          recommended: true,
          description: "富含Omega-3脂肪酸，有助于大脑健康",
          calories: 420,
          time: 25
        }
      ]);
      const activeIndex = vue.ref(-1);
      const longPressTimer = vue.ref(null);
      const showAddDialog = vue.ref(false);
      const handleTouchStart = (index) => {
        longPressTimer.value = setTimeout(() => {
          activeIndex.value = index;
        }, 800);
      };
      const handleTouchEnd = (index) => {
        clearTimeout(longPressTimer.value);
      };
      const handleItemClick = (index) => {
        if (activeIndex.value === index) {
          activeIndex.value = -1;
        }
      };
      const deleteItem = (index) => {
        uni.showModal({
          title: "提示",
          content: "确定要删除该食品吗？",
          success: (res) => {
            if (res.confirm) {
              foodList.value.splice(index, 1);
              activeIndex.value = -1;
              uni.showToast({
                title: "删除成功",
                icon: "success"
              });
            }
          }
        });
      };
      const addFoodItem = (value) => {
        if (!value)
          return;
        const newFood = {
          name: value,
          recommended: false,
          description: "请输入食品描述",
          calories: 0,
          time: 0
        };
        foodList.value.push(newFood);
        showAddDialog.value = false;
        uni.showToast({
          title: "添加成功",
          icon: "success"
        });
      };
      const __returned__ = { goBack, foodList, activeIndex, longPressTimer, showAddDialog, handleTouchStart, handleTouchEnd, handleItemClick, deleteItem, addFoodItem, ref: vue.ref, get onLoad() {
        return onLoad;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$1);
    const _component_uni_popup_dialog = resolveEasycom(vue.resolveDynamicComponent("uni-popup-dialog"), __easycom_1);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_2$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "food-management" }, [
      vue.createCommentVNode(" 头部 "),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createVNode(_component_uni_icons, {
          class: "icons-ui",
          type: "left",
          size: "25",
          color: "#333",
          onClick: $setup.goBack
        }),
        vue.createElementVNode("text", { class: "title" }, "食品管理")
      ]),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.foodList, (food, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "food-item",
            onTouchstart: ($event) => $setup.handleTouchStart(index),
            onTouchend: ($event) => $setup.handleTouchEnd(index),
            onClick: ($event) => $setup.handleItemClick(index)
          }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["food-content", { "active": $setup.activeIndex === index }])
              },
              [
                vue.createElementVNode("view", { class: "food-header" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "food-name" },
                    vue.toDisplayString(food.name),
                    1
                    /* TEXT */
                  ),
                  food.recommended ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "recommend-tag"
                  }, "推荐")) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode(
                  "text",
                  { class: "food-desc" },
                  vue.toDisplayString(food.description),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "food-footer" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "food-calories" },
                    vue.toDisplayString(food.calories) + "千卡",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "food-time" },
                    vue.toDisplayString(food.time) + "分钟",
                    1
                    /* TEXT */
                  )
                ])
              ],
              2
              /* CLASS */
            ),
            $setup.activeIndex === index ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "delete-btn",
              onClick: vue.withModifiers(($event) => $setup.deleteItem(index), ["stop"])
            }, [
              vue.createVNode(_component_uni_icons, {
                type: "trash",
                size: "24",
                color: "#fff"
              })
            ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
          ], 40, ["onTouchstart", "onTouchend", "onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createElementVNode("view", {
        class: "add-btn",
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.showAddDialog = true)
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "plusempty",
          size: "24",
          color: "#fff"
        })
      ]),
      vue.createCommentVNode(" 添加食品对话框 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "addDialog",
          type: "dialog"
        },
        {
          default: vue.withCtx(() => [
            vue.createVNode(_component_uni_popup_dialog, {
              mode: "input",
              title: "添加食品",
              placeholder: "请输入食品信息",
              onConfirm: $setup.addFoodItem
            })
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesFoodFood = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/pages/Food/Food.vue"]]);
  __definePage("pages/Login/Login", PagesLoginLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/user/user", PagesUserUser);
  __definePage("pages/chating/chating", PagesChatingChating);
  __definePage("pages/tabbar/tabbar", PagesTabbarTabbar);
  __definePage("pages/IngredientInfo/IngredientInfo", PagesIngredientInfoIngredientInfo);
  __definePage("pages/about/about", PagesAboutAbout);
  __definePage("pages/DaytoDay/DaytoDay", PagesDaytoDayDaytoDay);
  __definePage("pages/web-view/web-view", PagesWebViewWebView);
  __definePage("pages/camera/camera", PagesCameraCamera);
  __definePage("pages/playing/playing", PagesPlayingPlaying);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/Food/Food", PagesFoodFood);
  __definePage("pages/ResultView/ResultView", PagesResultViewResultView);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:9", "App Launch");
      const isLoggedIn = uni.getStorageSync("userToken");
      if (!isLoggedIn) {
        uni.reLaunch({
          url: "/pages/Login/Login"
        });
      }
    },
    onShow: function() {
      const isLoggedIn = uni.getStorageSync("userToken");
      const currentPages = getCurrentPages();
      const currentPage = currentPages[currentPages.length - 1];
      if (isLoggedIn && currentPage.route === "pages/Login/Login") {
        uni.reLaunch({
          url: "/pages/index/index"
        });
      }
      formatAppLog("log", "at App.vue:30", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:33", "App Hide");
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_router_view = vue.resolveComponent("router-view");
    return vue.openBlock(), vue.createElementBlock("view", { id: "app" }, [
      vue.createVNode(_component_router_view)
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/git仓库/GitHub/UniApp-foodCourt/uniApp-foodCourt/App.vue"]]);
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
