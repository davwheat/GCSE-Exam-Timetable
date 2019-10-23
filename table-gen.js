$(() => {
  fetch("exams.json")
    .then(val => val.json())
    .then(exams => {
      console.log(exams);

      let lastDate;

      exams.forEach(exam => {
        let hardBorder = false;

        if (new Date(exam.date) - lastDate >= 172800000) {
          hardBorder = true;
        }

        lastDate = new Date(exam.date);

        let html = `<tr${
          hardBorder ? ` class="date-gap"` : ``
        }><td>${lastDate.toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })}</td>`;

        if (exam.type && exam.type === "contingency") {
          html += `<td colspan="4" class="contingency"><strong>JCQ GCSE Contingency Day</strong><br/>If an exam cannot take place on its scheduled day, it will instead be taken on this day.</td>`;
        } else if (!exam.morning[0] && !exam.afternoon[0]) {
          html += `<td colspan="4" class="hatch"></td>`;
        } else {
          if (exam.morning[0]) {
            exam.morning.forEach(examInfo => {
              const colSpan = exam.morning.length === 1 ? 2 : 1;

              html += `<td colspan="${colSpan}" data-subjects="${examInfo.subjects.join(
                ","
              )},">
            <strong>${examInfo.name}${
                examInfo.paper ? ` (${examInfo.paper})` : ``
              }</strong><br />
            ${examInfo.examBoard}<br />
            ${examInfo.duration || ""}
          </td>`;
            });
          } else html += `<td colspan="2" class="hatch"></td>`;

          if (exam.afternoon[0]) {
            exam.afternoon.forEach(examInfo => {
              const colSpan = exam.afternoon.length === 1 ? 2 : 1;

              html += `<td colspan="${colSpan}" data-subjects="${examInfo.subjects.join(
                ","
              )},">
            <strong>${examInfo.name}${
                examInfo.paper ? ` (${examInfo.paper})` : ``
              }</strong><br />
            ${examInfo.examBoard}<br />
            ${examInfo.duration || ""}
          </td>`;
            });
          } else html += `<td colspan="2" class="hatch"></td>`;
        }

        html += `</tr>`;
        $("#table tbody").append(html);
      });

      // Highlight all exams that are pre-checked
      $("input[data-subject]").each(updateTimetable);
    });
});
