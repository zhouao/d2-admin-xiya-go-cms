import { mapActions } from 'vuex'
import utils from '@/utils'
import table from '@/mixins/crud.table.js'
import componentForm from './form'

export default {
  mixins: [ table ],
  components: { componentForm },
  render () {
    const page =
      <d2-container spacious>
        <d2-search-panel slot="header" vModel={ this.search.panel.active }>
          <d2-bar slot="title">
            <d2-bar-space/>
            <d2-bar-cell>{ this.vNodePaginationMini }</d2-bar-cell>
            <d2-bar-space/>
            <d2-bar-cell>
              <el-button-group>
                { this.vNodeButtonSearch }
                { this.vNodeButtonTableColumnsFilterTrigger }
              </el-button-group>
            </d2-bar-cell>
            <d2-bar-cell>{ this.vNodeButtonCreate }</d2-bar-cell>
          </d2-bar>
          { this.vNodeSearchForm }
        </d2-search-panel>
        { this.vNodeTable }
        <d2-bar slot="footer">
          <d2-bar-cell>{ this.vNodePaginationFull }</d2-bar-cell>
          <d2-bar-space/>
        </d2-bar>
        <component-form ref="form" on-success={ this.research }/>
        { this.vNodeTableColumnsFilter }
      </d2-container>
    return page
  },
  data () {
    return {
      api: {
        index: 'DICT_ALL',
        delete: 'DICT_DELETE'
      }
    }
  },
  computed: {
    // 配置项
    // 表格列
    // [prop] -> [label] -> [align] -> [minWidth][width] -> [fixed] -> [other] -> [render][formatter] -> [if][show]
    settingColumns () {
      return [
        { prop: 'dict_name', label: '名称', minWidth: '100px', fixed: 'left', render: ({ row }) => <d2-button type="text" label={ row.dict_name } on-click={ () => this.goDictData(row.id) }/> },
        { prop: 'dict_type', label: '标识', minWidth: '100px', render: ({ row }) => <d2-button type="text" label={ row.dict_type } on-click={ () => this.goDictData(row.id) }/> },
        { prop: 'status', label: '状态', width: '100px', show: false },
        { prop: 'remark', label: '备注', width: '100px', show: false },
        { prop: 'create_by', label: '创建人员', width: '100px', show: false },
        { prop: 'created_at', label: '创建时间', width: '200px', formatter: row => utils.time.format(row.created_at, 'YYYY/M/D HH:mm:ss'), show: false },
        { prop: 'update_by', label: '更新人员', width: '100px', show: false },
        { prop: 'updated_at', label: '更新时间', width: '200px', formatter: row => utils.time.format(row.updated_at, 'YYYY/M/D HH:mm:ss'), show: false }
      ].map(setting => {
        setting.sortable = 'custom'
        return setting
      })
    },
    // 配置项
    // 表格操作列
    // [prop] -> [label] -> [align] -> [minWidth][width] -> [fixed] -> [other] -> [render][formatter] -> [if][show]
    settingActions () {
      return [
        {
          label: '操作',
          align: 'center',
          width: '120px',
          fixed: 'right',
          render: ({ row }) => {
            const actions = [
              { icon: 'el-icon-edit-outline', action: () => this.edit(row.id) },
              { icon: 'el-icon-collection', action: () => this.goDictData(row.id) },
              { icon: 'el-icon-delete', type: 'danger', confirm: `确定删除 [ ${row.dict_name} ] 吗`, action: () => this.delete(row.id) }
            ]
            return <d2-table-actions actions={ actions }/>
          }
        }
      ]
    },
    // 配置项
    // 搜索
    // [prop] -> [label] -> [default] -> [render] -> [if][show]
    settingSearch () {
      return [
        {
          prop: 'dict_name',
          label: '名称',
          default: '',
          render: () => <el-input vModel={ this.search.form.model.dict_name } style="width:100px;" clearable/>
        },
        {
          prop: 'dict_type',
          label: '标识',
          default: '',
          render: () => <el-input vModel={ this.search.form.model.dict_type } style="width:100px;" clearable/>
        },
        {
          prop: 'start_time',
          label: '开始时间',
          default: '',
          render: () => <el-date-picker vModel={ this.search.form.model.start_time } value-format="yyyy-MM-dd" type="date" placeholder="开始时间" style="width:130px;"/>
        },
        {
          prop: 'end_time',
          label: '结束时间',
          default: '',
          render: () => <el-date-picker vModel={ this.search.form.model.end_time } value-format="yyyy-MM-dd" type="date" placeholder="结束时间" style="width:130px;"/>
        },
        {
          prop: 'status',
          label: '状态',
          default: 0,
          render: () => <d2-dict-radio vModel={ this.search.form.model.status } name="status" button all/>
        }
      ]
    }
  },
  methods: {
    ...mapActions('d2admin/page', [
      'closeBy'
    ]),
    goDictData (id) {
      this.closeBy(page => page.name === 'management-dict-data')
      this.$router.push({
        name: 'management-dict-data',
        query: {
          dict_id: id
        }
      })
    }
  }
}