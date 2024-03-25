import {useState, useEffect} from "react";
import './OverviewPage.css';
import MQTT from '../messenger/main'
import PillNil from '../resources/pill_statuses/nil.svg';
import PillYes from '../resources/pill_statuses/yes.svg';
import PillNo from '../resources/pill_statuses/no.svg';
import PillsSelect from '../components/PillsSelect'
import PillsListConfigure from "../components/PillsListConfigure";
import {getLatestMedicationNumber, getPillEntries, createPillEntry, updatePillEntry} from "../services/pillStatus";
import {getAllActivePills, getPrescription} from "../services/pillList";
import AlarmIcon from '@mui/icons-material/Alarm';

const mqttTopicPillsStatus = "pills/status";
const mqtt = new MQTT();
mqtt.connect();
// to remove
mqtt.subscribe("pills/status");
mqtt.subscribe("test");

function OverviewPage() {
  const [input, setInput] = useState("");
  const [beforeState, setBeforeState] = useState(0); //0 for nil, 1 for no, 2 for yes
  const [afterState, setAfterState] = useState(0); //0 for nil, 1 for no, 2 for yes
  const [beforeTime, setBeforeTime] = useState(null);
  const [afterTime, setAfterTime] = useState(null);

  const [pills, setPills] = useState({})
  const [beforePills, setBeforePills] = useState({});
  const [afterPills, setAfterPills] = useState({});

  const defaultPatientId = 1;
  let medicationId;
  let beforeMedicationId = 0;
  let afterMedicationId = 0;

  useEffect(() => {
    getAllActivePills().then((res) => {
      const temp = {}
      res.forEach((e) => {
        temp[String(e.name)] = e.weight
      })
      setPills(temp);
    })
  }, [])

  useEffect(() => {
    getLatestMedicationNumber(defaultPatientId).then(res => {
      medicationId = res + 1;
      console.log(medicationId);
    })
  }, [])

  useEffect(() => {
    getPrescription(defaultPatientId).then((res) => {
      const before = {}
      const after = {}
      res.forEach((e) => {
        if (e.medication_type == 'before') {
          before[e.name] = e.assigned
        } else {
          after[e.name] = e.assigned
        }
      })
      
      for (const k of Object.keys(pills)) {
        if (!(k in before)) {
          before[k] = false
        }
        if (!(k in after)) {
          after[k] = false
        }
      }
      setBeforePills(before);
      setAfterPills(after);
    })
  }, [pills])

  mqtt.client.on('message', (topic, uint8array) => {
    if (topic !== "pills/status") {
      return
    }
    let message = JSON.parse(new TextDecoder().decode(uint8array));
    const patientId = message["patient_id"]
    const action = message["action"]
    const weight = message["weight"]
    console.log(message)
    if (action === "before_new") {
      handleNewPill(patientId, "before", weight)
    } else if (action === "before_take") {
      handleTakePill(patientId, "before")
    } else if (action === "after_new") {
      handleNewPill(patientId, "after", weight)
    } else if (action === "after_take") {
      handleTakePill(patientId, "after")
    }
  });

  const handleNewPill = (patientId, type, weight) => {
    // handle pill weight verification
    if (type === "before") {
      let administeredTime = new Date()
      createPillEntry(patientId, medicationId, "before", administeredTime).then(() => {
        beforeMedicationId = medicationId;
        medicationId++;
        setBeforeState(1);
        setBeforeTime(administeredTime);
      })
    } else {
      let administeredTime = new Date()
      createPillEntry(patientId, medicationId, "after", administeredTime).then(() => {
        afterMedicationId = medicationId;
        medicationId++;
        setAfterState(1);
        setAfterTime(administeredTime);
      })
    }
  }

  const handleTakePill = (patientId, type) => {
    if (type === "before") {
      let consumedTime = new Date();
      updatePillEntry(patientId, beforeMedicationId, consumedTime).then(() => {
        setBeforeState(2);
        setBeforeTime(consumedTime);
      })
    } else {
      let consumedTime = new Date();
      updatePillEntry(patientId, afterMedicationId, consumedTime).then(() => {
        setAfterState(2);
        setAfterTime(consumedTime);
      })
    }
  }

  const stateToPillMap = {
    0: PillNil,
    1: PillNo,
    2: PillYes
  }

  const showResetModal = () => {
    return document.getElementById('id01').style.display='block';
  }

  const hideResetModal = () => {
    return document.getElementById('id01').style.display='none';
  }

  const showPrescriptionModal = () => {
    return document.getElementById('id02').style.display='block';
  }

  const hidePrescriptionModal = () => {
    return document.getElementById('id02').style.display='none';
  }

  const showConfigureModal = () => {
    return document.getElementById('id03').style.display='block';
  }

  const hideConfigureModal = () => {
    return document.getElementById('id03').style.display='none';
  }

  const handleReset = () => {
    if (beforeState === 1 || afterState === 1) {
      showResetModal()
      return;
    }
    resetPillStates();
  }

  const handleCfmReset = () => {
    resetPillStates();
    hideResetModal();
  }

  const resetPillStates = () => {
    setBeforeState(0);
    setAfterState(0);
    setBeforeTime(null);
    setAfterTime(null);
  }

  const handlePrescription = () => {
    showPrescriptionModal();
  }

  const alertPatient = (patientId, type) => {
    mqtt.publish("reminder/led", JSON.stringify({patientId, type}))
  }

  return (
    <>
    <div id="id01" class="modal">
      <span onClick={hideResetModal} class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Reset Pill Status for Bed 1</h1>
          <p>Our records show that there are pills unconsumed. Are you sure you want to reset the status?</p>

          <div class="clearfix">
            <button type="button" class="cancelbtn" onClick={hideResetModal}>Cancel</button>
            <button type="button" class="deletebtn" onClick={handleCfmReset}>Reset</button>
          </div>
        </div>
      </form>
    </div>
    <div id="id02" class="modal">
      <span onClick={hidePrescriptionModal} class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Configure Pills to be Taken</h1>

          <p>Select the latest prescription from Doctor</p>
          <div className="grid-container">
            <div className="grid-item">
              Before-Meal Pills
              <br></br>
                <PillsSelect pills={beforePills} setPills={setBeforePills}/>
            </div>
            <div className="grid-item">
              After-Meal Pills
              <br></br>
              <PillsSelect pills={afterPills} setPills={setAfterPills}/>
            </div>
          </div>
          <div class="clearfix">
            <button type="button" class="donebtn" onClick={hidePrescriptionModal}>Done</button>
          </div>
        </div>
      </form>
    </div>
    <div id="id03" class="modal">
      <span onClick={hideConfigureModal} class="close" title="Close Modal">&times;</span>
      <form class="modal-content">
        <div class="container">
          <h1>Pill List</h1>
          <PillsListConfigure pills={pills} setPills={setPills}/>
          <div class="clearfix">
            <button type="button" class="donebtn" onClick={hideConfigureModal}>Done</button>
          </div>
        </div>
      </form>
    </div>
    <h2>Overview Pills Status in Ward 27B</h2>
      <div className="grid-container">
        {/* <div>
          <br />
          <button onClick={()=>mqtt.publish("reminder/led", JSON.stringify({"patientId": 1, "type":"before"}))}>Get Entries</button>
        </div> */}
        <button onClick={showConfigureModal}>Configure Pills List</button>
        <div></div>
        <div className="grid-item">
          <button className="configure-btn" onClick={handlePrescription}>Prescription</button>
          <button className="reset-btn" onClick={handleReset}>Reset</button>
          <h1><a href="/records/1">Bed 1</a></h1>
          <div className="sub-grid">
            <div className="pill-info-box">
              <p className="pill-title">Before Meal Pill(s)</p>
              <img src={stateToPillMap[beforeState]} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(1,"before")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> {beforeTime?beforeTime.toLocaleTimeString():"-"}</p>
            </div>
            <div>
              <p className="pill-title">After Meal Pill(s)</p>
              <img src={stateToPillMap[afterState]} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(1,"after")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> {afterTime?afterTime.toLocaleTimeString():"-"}</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <button className="configure-btn">Prescription</button>
          <button className="reset-btn">Reset</button>
          <h1><a href="/records/2">Bed 2</a></h1>
          <div className="sub-grid">
            <div className="pill-info-box">
              <p className="pill-title">Before Meal Pill(s)</p>
              <img src={PillYes} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(2,"before")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> 11:00:00 AM</p>
            </div>
            <div>
              <p className="pill-title">After Meal Pill(s)</p>
              <img src={PillNo} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(2,"after")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> 10:55:00 AM</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <button className="configure-btn">Prescription</button>
          <button className="reset-btn">Reset</button>
          <h1><a href="/records/3">Bed 3</a></h1>
          <div className="sub-grid">
            <div className="pill-info-box">
              <p className="pill-title">Before Meal Pill(s)</p>
              <img src={PillYes} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(3,"before")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> 12:00:00 PM</p>
            </div>
            <div>
              <p className="pill-title">After Meal Pill(s)</p>
              <img src={PillYes} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(3,"after")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> 12:58:00 PM</p>
            </div>
          </div>
        </div>
        <div className="grid-item">
          <button className="configure-btn">Prescription</button>
          <button className="reset-btn">Reset</button>
          <h1><a href="/records/4">Bed 4</a></h1>
          <div className="sub-grid">
            <div className="pill-info-box">
              <p className="pill-title">Before Meal Pill(s)</p>
              <img src={PillNil} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(4,"before")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> - </p>
            </div>
            <div>
              <p className="pill-title">After Meal Pill(s)</p>
              <img src={PillYes} alt="Pill Status" style={{ width: '150px', height: 'auto' }} />
              <button onClick={()=>alertPatient(4,"after")}><AlarmIcon/></button>
              <p className="pill-status-text">Last Updated: <br/> 13:11:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
