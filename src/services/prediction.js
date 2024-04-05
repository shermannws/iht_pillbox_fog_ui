const url = process.env.REACT_APP_CLOUD_URL
// const url = 'http://localhost:5000'

export function getPrediction(medicationtype, administeredtime) {
  const params = {
    medicationtype,
    administeredtime
  }
  return fetch(`${url}/predict?${new URLSearchParams(params)}`).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
      console.log('Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
      console.log('Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
      return response.json();
    })
}
