import { computed, defineComponent ,onMounted,ref} from "@vue/composition-api";

export const switchProps = {
  value: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 40,
  },
  activeColor: {
    type: String,
    default: "",
  },
  inactiveColor: {
    type: String,
    default: "",
  }
}

export const lkSwitch = defineComponent({
  name:"lkSwitch",
  props:switchProps,
  emits: ["input", "change"],
  setup(props,ctx){
    const currentVal = ref(props.value);
    const core = ref(null);
    const handleChange = (): void => {
      ctx.emit("input", currentVal.value);
      ctx.emit("change", currentVal.value);
      setBackgroundColor();
    };
    const setBackgroundColor = (): void => {
      const newColor = currentVal.value
        ? props.activeColor
        : props.inactiveColor;
      const coreEl = core.value;
      coreEl.style.backgroundColor = newColor;
    };
    const inputValue = (e):void=>{
      currentVal.value = !e.target._value;
    }
    let labelClass = computed({
      get(){
        return {'is-active': currentVal.value, 'is-disabled': props.disabled,'lk-switch':true}
      },
      set(){}
    })

    onMounted(() => {
      if (props.activeColor || props.inactiveColor) setBackgroundColor();
    });
    return { core, currentVal, handleChange,inputValue ,labelClass};
  },
  render(h){
    return (<label class={this.labelClass}>
      <input 
        ref="input"
        value={this.currentVal}
        onInput={this.inputValue}
        type="checkbox"
        class="lk-switch-input"
        disabled={this.disabled}
        onChange={this.handleChange}/>
      <span ref="core" class="lk-switch-inner" style={{width:this.width+'px'}}></span>
    </label>);
  }
})