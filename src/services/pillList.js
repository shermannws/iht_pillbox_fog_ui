const url = 'http://localhost:3002'

export function getAllActivePills() {
  return fetch(url + `/pill-list`)
    .then(response => {
      return response.json();
    });
}

export function addNewPill(name, weight) {
  const body = {
    name,
    weight
  }
  fetch(url + '/pill', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      return response.text();
    })
}

export function deletePillFromList(name) {
  const body = {
    name
  }
  fetch(url + '/pill', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => {
      return response.text();
    })
}


export function getPrescription(patientId) {
  return fetch(url + `/prescription/patient/${patientId}`)
    .then(response => {
      return response.json();
    });
}