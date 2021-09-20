const priority = ["Low", "Normal", "High", "Critical"];

let parentID = 1;
let childCount = Math.ceil(Math.random() * 10);

function randomDate(date1, date2) {
  function randomValueBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  var date1 = date1 || "01-01-2021";
  var date2 = date2 || new Date().toLocaleDateString();
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  if (date1 > date2) {
    return new Date(randomValueBetween(date2, date1)).toLocaleDateString();
  } else {
    return new Date(randomValueBetween(date1, date2)).toLocaleDateString();
  }
}

export const source = [...Array(100)].map((val, index) => {
  const from = new Date(randomDate("2021-01-01", "2021-12-31"));
  const to = new Date(randomDate("2021-01-01", "2021-12-31"));
  const obj = {
    TaskID: index + 1,
    TaskName:
      parentID === index + 1
        ? "Parent Task " + (index + 1)
        : "Child Task " + (index + 1),
    StartDate: from.getTime() > to.getTime() ? to : from,
    EndDate: from.getTime() < to.getTime() ? to : from,
    Duration: Math.floor(Math.random() * 10),
    Priority: priority[Math.floor(Math.random() * priority.length)],
    Progress: Math.floor(Math.random() * 100),
  };
  if (childCount > 0 && parentID < index + 1) {
    obj["parentID"] = parentID;
    childCount--;
  } else if (childCount === 0) {
    obj["parentID"] = parentID;
    parentID = index + 2;
    childCount = Math.ceil(Math.random() * 10);
  }
  return obj;
});
