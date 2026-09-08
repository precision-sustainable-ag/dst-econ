const pirschAnalytics = (eventName, meta) => {
    if (/(localhost|dev)/i.test(window.location.hostname)) return;
    window.pirsch?.(eventName, meta);
};
export default pirschAnalytics;
