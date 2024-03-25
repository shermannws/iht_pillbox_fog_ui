
const url = 'http://localhost:3002'

export function getPillEntries(patientId) {
  return fetch(url + `/pillStatuses/patient/${patientId}`)
    .then(response => {
      return response.json();
    });
}

export function getLatestMedicationNumber(patientId) {
  return getPillEntries(patientId).then(data => {
    let max = 0;
    for (let e of data) {
      if (e.medicationid > max) {
        max = e.medicationid;
      }
    }
    return max
  })
}

export function createPillEntry(patientId, medicationId, medicationType, administeredTime) {
  const body = {
    patientId,
    medicationId,
    medicationType,
    administeredTime
  }
  return fetch(url + '/pillStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      return response.text();
    })
    // .then(data => {
    //   alert(data);
    //   getMerchant();
    // });
}

export function updatePillEntry(patientId, medicationId, consumedTime) {
  return fetch(url + `/pillStatus/patient/${patientId}/medication/${medicationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({consumedTime}),
  })
    .then(response => {
      return response.text();
    })
    // .then(data => {
    //   alert(data);
    //   getMerchant();
    // });
}