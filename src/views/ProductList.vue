<template>
  <Modal
    v-model:open="isModalOpen"
    centered
    closable
    @cancel="handleModalClose"
    :bodyStyle="{
      padding: '30px 30px 0'
    }"
  >
    <Form
      :model="formState"
      @finish="handleFinish"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 13 }"
    >
      <FormItem label="Name" name="name">
        <Input v-model:value="formState.name" disabled />
      </FormItem>
      <FormItem label="Gender" name="gender">
        <Input v-model:value="formState.gender" disabled />
      </FormItem>
      <FormItem label="Height" name="height">
        <InputNumber v-model:value="formState.height" :min="50" :max="300" />
      </FormItem>
      <FormItem label="Hair Color" name="hair_color">
        <RadioGroup v-model:value="formState.hair_color">
          <div
            class="radio-item"
            v-for="(hairColor, hairColorIndex) in hairColors"
            :key="hairColorIndex"
          >
            <Radio :style="radioStyle" :value="hairColor">
              {{ hairColor }}
            </Radio>
            <div class="color-box" :style="{ 'background-color': hairColor }"></div>
          </div>
        </RadioGroup>
      </FormItem>
      <FormItem label="Price" name="price">
        <InputNumber v-model:value="formState.price" :min="10000" :max="1000000" />
      </FormItem>
      <FormItem label="In Stock" name="in_stock">
        <Checkbox v-model:checked="formState.in_stock" />
      </FormItem>
      <FormItem :wrapper-col="{ offset: 5, span: 16 }" label="" name="actions">
        <BaseButton type="primary" html-type="submit">Submit</BaseButton>
        <BaseButton style="margin-left: 10px" danger @click="isModalOpen = false">
          Cancel
        </BaseButton>
      </FormItem>
    </Form>

    <template #footer />
  </Modal>

  <Table :columns="columns" :dataSource="productData" :pagination="false" :loading="isLoading">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.key === 'hair_color'">
        <div class="color-display">
          <span class="color"> {{ record.hair_color }}</span>
          <div class="color-box" :style="{ 'background-color': record.hair_color }" />
        </div>
      </template>
      <template v-if="column.key === 'price'">
        {{ formatStringToPrice.format(record.price) }}
      </template>

      <template v-if="column.key === 'in_stock'">
        <template v-if="record.in_stock">
          <CheckCircleOutlined style="color: #5a7960" />
        </template>
        <template v-else>
          <CloseCircleOutlined style="color: #f9423a" />
        </template>
      </template>

      <template v-if="column.key === 'actions'">
        <BaseButton @click="handleEdit(record, index)">Edit</BaseButton>
      </template>
    </template>
  </Table>
</template>

<script setup>
import { getProducts } from '../services/products.js'
import { ref, reactive } from 'vue'
import BaseButton from '../components/base/BaseButton.vue'
import {
  Table,
  Modal,
  Input,
  Checkbox,
  InputNumber,
  Form,
  FormItem,
  RadioGroup,
  Radio
} from 'ant-design-vue'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { isEqual } from 'lodash'

const productData = ref([])
const rawData = ref({})
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedRowData = ref({})
const selectedRowIndex = ref(null)
const radioStyle = reactive({
  display: 'flex',
  height: '30px',
  lineHeight: '30px'
})
const hairColors = ref([
  'red',
  'blue',
  'green',
  'gray',
  'purple',
  'yellow',
  'orange',
  'cyan',
  'black',
  'brown'
])

const formState = ref({})

getProducts()
  .then((response) => {
    rawData.value = response.data
    productData.value = response.data.results.map((result) => {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

      return {
        name: result.name,
        height: Number(result.height),
        gender: result.gender,
        hair_color: hairColors.value[Math.floor(Math.random() * hairColors.value.length)],
        price: getRandomInt(10000, 1000000),
        in_stock: [true, false][Math.floor(Math.random() * 2)]
      }
    })
    isLoading.value = false
  })
  .catch((error) => {
    alert(error)
  })

const columns = ref([
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    align: 'center'
  },
  {
    title: 'Height',
    dataIndex: 'height',
    key: 'height',
    align: 'center'
  },
  {
    title: 'Hair Color',
    dataIndex: 'hair_color',
    key: 'hair_color',
    align: 'center'
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'center'
  },
  {
    title: 'In Stock',
    dataIndex: 'in_stock',
    key: 'in_stock',
    align: 'center'
  },
  {
    title: 'Action',
    key: 'actions',
    align: 'center'
  }
])

const formatStringToPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR'
})

function handleEdit(row, index) {
  selectedRowData.value = { ...row }
  selectedRowIndex.value = index
  formState.value = { ...row }
  isModalOpen.value = true
}

function handleModalClose() {
  selectedRowData.value = {}
  formState.value = {}
}

function handleFinish(values) {
  const isSame = isEqual(values, selectedRowData.value)

  if (!isSame) {
    productData.value[selectedRowIndex.value] = values
  }

  isModalOpen.value = false
}
</script>

<style>
.color-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.color-box {
  height: 20px;
  width: 40px;
  border-radius: 4px;
}

.ant-modal-content {
  padding: 60px 40px;
}

.radio-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ant-table-wrapper {
  min-height: 705px;
}
</style>
