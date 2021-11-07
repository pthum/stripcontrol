import emitter from "tiny-emitter/instance";
class EventBusClz {
  /** makes a toast, expects an object with content field and variant field */
  makeToast(vm, toastData) {
    vm.$q.notify(toastData);
    // vm.$bvToast.toast(toastData.content, {
    //   title: ` ${toastData.variant || "default"}`,
    //   variant: toastData.variant,
    //   solid: true,
    // });
  }
  $on(...args) {
    emitter.on(...args);
  }
  $once(...args) {
    emitter.once(...args);
  }
  $off(...args) {
    emitter.off(...args);
  }
  $emit(...args) {
    emitter.emit(...args);
  }
}
const EventBus = new EventBusClz();
export default EventBus;
