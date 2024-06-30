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

const identityToUserType = {
  "Candidat·e": "candidate",
  Journaliste: "journalist",
  "Etudiant·e/Chercheur·se": "researcher",
};

window.addEventListener("message", (e) => {
  if (typeof e?.data === "string" && e.data.includes("Tally.FormSubmitted")) {
    const payload = JSON.parse(e.data).payload;

    let identity = undefined;
    if (isCandidate(payload)) {
      identity = "Candidat·e";
    } else if (isJournalist(payload)) {
      identity = "Journaliste";
    } else if (isStudent(payload)) {
      identity = "Etudiant·e/Chercheur·se";
    }

    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userType: identityToUserType[identity],
        message: formatResponse(payload, identity),
      }),
    };

    console.log({ options });

    fetch(
      "https://us-central1-civil-celerity-428013-f5.cloudfunctions.net/function-1",
      options
    )
      .catch((err) => console.error(err))
      .then((response) => console.log(response));
  }
});
