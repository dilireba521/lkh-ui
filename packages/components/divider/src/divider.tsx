
import { defineComponent ,PropType,computed } from "@vue/composition-api";

export const dividerProps = {
  type :{
    type:String as PropType<"horizontal"|"vertical">,
    default:"horizontal"
  },
  contentPosition:{
    type:String as PropType<"left"|"center"|"right">,
    default:"left"
  },
  dashed :{
    type:Boolean,
    default:false
  }
}

export const lkDivider = defineComponent({
  name: "lkDivider",
  props: dividerProps,
  setup(props,context){
    let dividerClass =  computed({
       get(){
        return [
          "lk-divider",
          `lk-divider-${props.type}`,
          `lk-divider-${props.contentPosition}`,
          { "is-dashed": props.dashed, nodivider: !context.slots.default },
         ]
      },
      set(){}
    });
    return {dividerClass}
  },
  render(h){
    const showDefault = this.$slots.default && this.type==='horizontal';
    return (<div class={this.dividerClass}>
    {showDefault? <span class='lk-inner-text'>{this.$slots.default}</span>:""}
    </div>)
  }
})