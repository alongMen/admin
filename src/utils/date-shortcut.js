export default [
  {
    text: '本日',
    value() {
      const end = new Date();
      let start = new Date();
      start = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        0,
        0,
        0,
      );
      return [start, end];
    },
  },
  {
    text: '近3天',
    value() {
      const end = new Date();
      let start = new Date();
      start = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() - 2,
      );
      return [start, end];
    },
  },
  {
    text: '本周',
    value() {
      const end = new Date();
      let start = new Date();
      const weekday = start.getDay() || 7;
      start = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() - weekday + 1,
      );
      return [start, end];
    },
  },
  {
    text: '本月',
    value() {
      const end = new Date();
      let start = new Date();

      start = new Date(start.getFullYear(), start.getMonth(), 1);
      return [start, end];
    },
  },
  {
    text: '上月',
    value() {
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end.setDate(0);
      end = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
      );
      return [start, end];
    },
  },
  {
    text: '近3月内',
    value() {
      const end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
      start = new Date(start.getFullYear(), start.getMonth(), 1);

      return [start, end];
    },
  },
];
