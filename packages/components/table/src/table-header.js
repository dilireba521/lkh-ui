import Vue from 'vue';

export default {
  name: 'lkTableHeader',
  render() {
    return (
      <table
        class="lk-table_header"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          <col></col>
        </colgroup>
        <thead>
          <tr>
            <th>header</th>
          </tr>
        </thead>
      </table>
    )
  },
  props: {
    fixed: String,
    store: {
      require: true
    },
    border: Boolean,
    defaultSort: {
      type: Object,
      default() {
        return {
          prop: '',
          order: ''
        }
      }
    }
  }
}