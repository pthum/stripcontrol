import emitter from "tiny-emitter/instance";
class EventBusClz {
  /** makes a toast, expects an object with content field and variant field */
  makeToast(vm, toastData) {
    vm.$q.notify(toastData);
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
