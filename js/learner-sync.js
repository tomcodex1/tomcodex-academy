(function () {
  const supported = (key) => key === "salesforceMasterDashboard.v1"
    || key === "tomcodex.learningRecords.v1"
    || key === "tomcodex.interviewHistory.v1"
    || key === "tomcodex.courseEnrollments.v1"
    || key === "tomcodex.personalizedPath.v1"
    || key === "tomcodex.aiCodeReviews.v1"
    || key === "tomcodex.adminCourseProgress.v1"
    || /^tomcodex\.(admin|apex|flow|lwc)MasteryScores\.v1(\.finalExam)?$/.test(key);
  const originalSetItem = Storage.prototype.setItem;
  let pending = Promise.resolve();

  function sync(key, value) {
    if (!supported(key)) return pending;
    pending = pending.then(() => fetch("/api/student-progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value })
    })).catch(() => {});
    return pending;
  }

  Storage.prototype.setItem = function (key, value) {
    originalSetItem.call(this, key, value);
    if (this === window.localStorage) sync(String(key), String(value));
  };

  window.TomCodexLearnerSync = { sync, flush: () => pending };
})();
