import { slideDown, slideUp, slideStop } from 'slide-anim';
// import Plugin from '@/base/scripts/core/Plugin.js';
// import init from '@/base/scripts/core/init.js';
// import toArray from '@/base/scripts/helpers/DOM/toArray.js';
import Plugin from '@core/Plugin.js';
import init from '@core/init.js';
import toArray from '@helpers/DOM/toArray.js';

class Accordion extends Plugin {
  defaults() {
    return {
      itemSelector: '[data-accordion-item]',
      triggerSelector: '[data-accordion-trigger]',
      panelSelector: '[data-accordion-panel]',
      itemActiveAttr: 'data-accordion-item-open',
      mode: this.element.getAttribute('data-accordion-mode') || 'single', // "multiple"
      duration: 400,
    };
  }

  buildCache() {
    this.items = toArray(
      this.element.querySelectorAll(this.options.itemSelector),
    ).filter((item) => {
      const isDisabled = this.isItemDisabled(item);
      const isOpen = this.isOpen(item);

      if (isDisabled) {
        this.setItemDisabled(item);
      }

      if (!isOpen) {
        const panel = this.getPanel(item);
        panel.style.display = 'none';
      }

      return !isDisabled;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  isItemDisabled(item) {
    return (
      item.getAttribute('aria-disabled') === 'true'
      || item.hasAttribute('disabled')
      || false
    );
  }

  getTrigger(item) {
    return item.querySelector(this.options.triggerSelector);
  }

  getPanel(item) {
    return item.querySelector(this.options.panelSelector);
  }

  setItemDisabled(item) {
    const trigger = this.getTrigger(item);

    trigger.setAttribute('disabled', true);
    this.element.setAttribute('aria-disabled', true);
  }

  bindEvents() {
    this.items.forEach((item) => {
      const trigger = item.querySelector(this.options.triggerSelector);

      trigger.addEventListener('click', (event) => {
        this.handleTriggerClick(event, item);
      });
    });
  }

  get slideOptions() {
    return {
      duration: this.options.duration,
    };
  }

  open(item) {
    this.toggleVisibility(item, true);
  }

  close(item) {
    this.toggleVisibility(item, false);
  }

  toggleVisibility(item, visibility) {
    const trigger = this.getTrigger(item);
    const panel = this.getPanel(item);

    item.setAttribute(this.options.itemActiveAttr, visibility);
    trigger.setAttribute('aria-expanded', visibility);
    panel.setAttribute('aria-hidden', !visibility);

    slideStop(panel);

    if (visibility) slideDown(panel, this.slideOptions);
    else slideUp(panel, this.slideOptions);
  }

  toggle(item) {
    if (this.isOpen(item)) {
      this.close(item);
    } else {
      this.open(item);
    }
  }

  isOpen(item) {
    return item.getAttribute(this.options.itemActiveAttr) === 'true';
  }

  handleTriggerClick(event, item) {
    event.preventDefault();

    if (this.options.mode === 'single') {
      this.items.forEach((index) => {
        if (index !== item) {
          this.close(index);
        }
      });
    }

    this.toggle(item);
  }
}

export default init(Accordion, 'accordion');
