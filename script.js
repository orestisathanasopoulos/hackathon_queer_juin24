function getIdentityField(payload) {
  return payload.fields.find(
    (field) => field.id === "e3208b43-5c7f-4efa-9b10-cc3d6cb71f34"
  );
}

function isCandidate(payload) {
  return getIdentityField(payload)?.answer.value.includes("rejoindre");
}

function isJournalist(payload) {
  return getIdentityField(payload)?.answer.value.includes("journaliste");
}

function isStudent(payload) {
  return getIdentityField(payload)?.answer.value.includes("recherche");
}

function formatResponse(payload, title) {
  const embeds = [
    {
      title,
      color: 33023, // This is optional, you can look for decimal colour codes at https://www.webtoolkitonline.com/hexadecimal-decimal-color-converter.html
      fields: payload.fields.map((field) => ({
        name: field.title,
        value: field.answer.value,
      })),

      timestamp: new Date().toISOString(),
    },
  ];
  return { embeds };
}

window.addEventListener("message", (e) => {
  if (typeof e?.data === "string" && e.data.includes("Tally.FormSubmitted")) {
    const payload = JSON.parse(e.data).payload;

    let webhook = undefined;
    let identity = undefined;
    if (isCandidate(payload)) {
      console.log("candidate");
      identity = "Candidat·e";
      webhook = process.env.WEBHOOK_CANDIDATE;
    } else if (isJournalist(payload)) {
      console.log("Journalist");
      identity = "Journaliste";
      webhook = pr;
    } else if (isStudent(payload)) {
      console.log("Etudiant·e/Chercheur·se");
      identity = "Etudiant·e/Chercheur·se";
      webhook = process.env.WEBHOOK_STUDENT;
    }
    if (!webhook) return;

    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formatResponse(payload, identity)),
    };

    console.log({ options });

    fetch(webhook, options)
      .catch((err) => console.error(err))
      .then((response) => console.log(response));
  }
});
