<template>
  <div class="search-area">
    <div class="more" @click="clickForMore" v-if="moreForm.length > 0">
      {{ showMore ? '收起筛选' : '展开筛选' }}&nbsp;
      <Icon
        type="ios-arrow-up"
        class="more-icon"
        :class="{ 'icon-open': showMore }"
      ></Icon>
    </div>
    <Row style="width:100%">
      <Col
        v-for="(item, i) in defaultForm"
        :key="i"
        :span="8"
        class="flex vertical"
      >
        <span class="label">{{ item.label }}</span>

        <template v-if="item.type === 'text'">
          <Input
            v-model="query[item.field]"
            style="max-width:280px;"
            :placeholder="item.placeholder ? item.placeholder : '请填写'"
            size="small"
          />
        </template>
        <template v-if="item.type === 'radioButton'">
          <RadioGroup v-model="query[item.field]" type="button" size="small">
            <Radio
              :label="option.value"
              v-for="option in item.options"
              :key="option.label"
            >
              {{ option.label }}
            </Radio>
          </RadioGroup>
        </template>
        <template v-if="item.type === 'multipleSelect'">
          <Select
            v-model="query[item.field]"
            style="max-width:280px;"
            multiple
            size="small"
          >
            <Option
              v-for="(option, inx) in item.options"
              :key="inx"
              :value="option.value"
            >
              {{ option.label }}
            </Option>
          </Select>
        </template>
        <template v-if="item.type === 'select'">
          <Select
            v-model="query[item.field]"
            style="max-width:280px;"
            :placeholder="item.placeholder ? item.placeholder : '请选择'"
            size="small"
            @on-change="value => selectChange(value, item)"
          >
            <Option
              v-for="(option, inx) in item.options"
              :key="inx"
              :value="
                item.selectValue ? option[item.selectValue] : option.value
              "
            >
              {{ item.selectLabel ? option[item.selectLabel] : option.label }}
            </Option>
          </Select>
        </template>
        <template v-if="item.type === 'timeRange'">
          <DatePicker
            type="datetimerange"
            placeholder="选择日期和时间"
            style="width: 280px"
            v-model="query[item.field]"
            size="small"
            format="yyyy-MM-dd HH:mm"
            :options="options"
          >
          </DatePicker>
        </template>

        <template v-if="item.type === 'numberRange'">
          <InputNumber v-model="query.min" size="small"></InputNumber>
          &nbsp;&nbsp; - &nbsp;&nbsp;
          <InputNumber v-model="query.max" size="small"></InputNumber>
        </template>
      </Col>
    </Row>
    <el-collapse-transition>
      <Row style="width:100%" ref="hideForm" class="hideForm" v-show="showMore">
        <Col
          v-for="(item, i) in moreForm"
          :key="i"
          :span="8"
          class="flex vertical"
        >
          <span class="label">{{ item.label }}</span>

          <template v-if="item.type === 'text'">
            <Input
              v-model="query[item.field]"
              style="max-width:280px;"
              :placeholder="item.placeholder ? item.placeholder : '请填写'"
              size="small"
            />
          </template>
          <template v-if="item.type === 'radioButton'">
            <RadioGroup v-model="query[item.field]" type="button" size="small">
              <Radio
                :label="option.value"
                v-for="option in item.options"
                :key="option.label"
              >
                {{ option.label }}
              </Radio>
            </RadioGroup>
          </template>
          <template v-if="item.type === 'multipleSelect'">
            <Select
              v-model="query[item.field]"
              style="max-width:280px;"
              multiple
              size="small"
            >
              <Option
                v-for="(option, inx) in item.options"
                :key="inx"
                :value="option.value"
              >
                {{ option.label }}
              </Option>
            </Select>
          </template>
          <template v-if="item.type === 'select'">
            <Select
              @on-change="value => selectChange(value, item)"
              v-model="query[item.field]"
              style="max-width:280px;"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
              size="small"
            >
              <Option
                v-for="(option, inx) in item.options"
                :key="inx"
                :value="
                  item.selectValue ? option[item.selectValue] : option.value
                "
              >
                {{ item.selectLabel ? option[item.selectLabel] : option.label }}
              </Option>
            </Select>
          </template>
          <template v-if="item.type === 'timeRange'">
            <DatePicker
              type="datetimerange"
              placeholder="选择日期和时间"
              style="width: 280px"
              v-model="query[item.field]"
              size="small"
              format="yyyy-MM-dd HH:mm"
              :options="options"
            >
            </DatePicker>
          </template>
          <template v-if="item.type === 'numberRange'">
            <InputNumber v-model="query.min" size="small"></InputNumber>
            &nbsp;&nbsp; - &nbsp;&nbsp;
            <InputNumber v-model="query.max" size="small"></InputNumber>
          </template>
        </Col>
      </Row>
    </el-collapse-transition>

    <div class="maxWidth flex verticalCenter">
      <div class="search-btn" @click="search">
        <Icon type="ios-search" :size="20"></Icon>
      </div>
      <div class="search-btn" @click="reset">
        <Icon type="ios-refresh" :size="22"></Icon>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import shortcut from '@/utils/date-shortcut';
export default {
  props: {
    defaultForm: Array, // label 标题  type 类型   field 字段
    value: Object,
    moreForm: Array,
  },
  computed: {
    query: {
      get() {
        return this.value;
      },
      set(query) {
        this.$emit('input', query);
      },
    },
  },
  data() {
    return {
      showMore: false,
      options: {
        shortcuts: shortcut,
      },
    };
  },
  methods: {
    search() {
      this.$emit('search');
    },
    reset() {
      // this.query = {};
      this.$emit('reset');
    },
    clickForMore() {
      this.showMore = !this.showMore;
    },
    selectChange(value, item) {
      if (item.event) {
        this.$emit('selectChange', value);
      }
    },
  },
};
</script>

<style lang="less">
.search-area {
  width: 100%;
  // display: flex;
  position: relative;
  padding: 20px;
  .hideForm {
    transition: all 0.2s ease-in-out;
  }
  .more {
    position: absolute;
    right: 20px;
    top: 0px;
    cursor: pointer;
    z-index: 5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #4a95ec;
    user-select: none;
    .more-icon {
      transition: all 0.2s linear;
    }
    .icon-open {
      transform: rotate(180deg);
    }
  }
  .ivu-col-span-8 {
    margin-top: 10px;
  }
  .label {
    width: 120px;
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
    display: block;
    &::after {
      content: ':';
    }
  }
  .form-item {
    width: 340px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .search-btn {
    margin-top: 20px;
    width: 53px;
    height: 26px;
    background: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(51, 51, 51, 0.24);
    border-radius: 3px;
    line-height: 26px;
    text-align: center;
    margin-right: 20px;
    transform: translateX(-50%);
    cursor: pointer;
  }
}
.collapse-transition {
  -webkit-transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
</style>
