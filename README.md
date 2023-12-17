## El7a2ny: Virtual Clinic and Pharmacy

#### Motivation
The El7a2ny project is motivated to provide a comprehensive virtual clinic and pharmacy solution that will change healthcare accessibility and improve the effectiveness of medical services. The main objective is to develop a smooth platform that facilitates communication between doctors, patients, and pharmacists in order to promote a more integrated healthcare ecosystem.

#### Build Status
- There are some styling problems 
- the Backend code can be optimised as it is slightly slow 
- the images can be stored online instead of the data

#### Code Style 
The project is formatted using prettier, ESLint, and the MVC design pattern, MVC software architectural pattern divides the associated program logic into three interconnected pieces, which are then used to construct user interfaces. This is done in order to distinguish between how information is displayed to and accepted from the user and internal representations of that information. Therefore, the backend files were separated into three categories: M (models), which contain the model schema and reflect the database's core; C (controller), which contains the functions required for the routes; and V (views), which are representations of the MERN stack's views and are represented by the react frontend server. Additionally, as can be seen in API References, our project's routes were abstracted from the controller function. 

#### Tech and Frameworks
MERN stands for MongoDB, Express, React, Node, after the four key technologies that make up the stack.

- MongoDB - document database
- Express(.js) - Node.js web framework
- React(.js) - a client-side JavaScript framework
- Node(.js) - the premier JavaScript web server

Express and Node make up the middle (application) tier. Express.js is a server-side web framework, and Node.js the JavaScript server platform.

#### Code Examples

```javascript
const requireAuthDoctor = (req, res, next) => {
  const token = req.cookies.jwt;
    if (token) {  
      jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({message:"You are not logged in."})
      } else {
        if(decodedToken.user.type!="doctor"){
          res.status(401).json({message:"You are not logged in."})
        }
        else{
          req.user=decodedToken.user;
          next();
        }
      }
    });
  } else {
    res.status(401).json({message:"You are not logged in."})
  }
}
```

```javascript
const acceptRequest = async (req, res) => {
  const doctorToBeAccepted = await requestsTable.findOne({
    email: req.body.email,
  });

  let id = {
    data: doctorToBeAccepted.id.data,
    contentType: doctorToBeAccepted.id.contentType,
  };

  let medicalLicense = {
    data: doctorToBeAccepted.medicalLicense.data,
    contentType: doctorToBeAccepted.medicalLicense.contentType,
  };

  let medicalDegree = {
    data: doctorToBeAccepted.medicalDegree.data,
    contentType: doctorToBeAccepted.medicalDegree.contentType,
  };

  let doctor = new doctorsTable({
    name: doctorToBeAccepted.name,
    username: doctorToBeAccepted.username,
    password: doctorToBeAccepted.password,
    email: doctorToBeAccepted.email,
    speciality: doctorToBeAccepted.speciality,
    DOB: doctorToBeAccepted.DOB,
    mobile: doctorToBeAccepted.mobile,
    rate: doctorToBeAccepted.rate,
    affiliation: doctorToBeAccepted.affiliation,
    education: doctorToBeAccepted.education,
    Wallet: 0,
    id: id,
    medicalDegree: medicalDegree,
    medicalLicense: medicalLicense,
    acceptedContract: false,
  });
  doctor = await doctor.save();
  await requestsTable.deleteOne({ email: req.query.email });
  const requests = await requestsTable.find();
  res.status(200).json({ requests: requests, message: "Doctor accepted" });
};
```
```javascript
async function cancelAppointment(req, res) {
  const id = req.body.id;
  const deletedAppointment = await appointment
    .findByIdAndUpdate(id, { status: "cancelled" }, { new: 1 })
    .exec();
  let dateConverted = (new Date(deletedAppointment.date)).toISOString();
  const date = `${dateConverted.split("T")[0]} at ${parseInt(dateConverted.split("T")[1].split(".")[0].split(":")[0])+2}:${dateConverted.split("T")[1].split(".")[0].split(":")[1]}`
  const wallet = deletedAppointment.price;
  const patient = await patientModel.findById(deletedAppointment.patientID,"-healthRecords");
  patient.wallet += wallet;
  await patient.save();
  const doctore = await doctor.findById(deletedAppointment.doctorID);
  doctore.Wallet -= wallet;
  await doctore.save();
  let newNotification = new notificationModel({
    patientID: patient._id,
    text: `Your appointment on ${date} has been cancelled by the doctor and the amount has been refunded to your wallet`,
    read: false,
    date: Date.now(),
  });
  await newNotification.save();

  let newNotification2 = new notificationModel({
    doctorID: deletedAppointment.doctorID,
    text: `Your appointment on ${date} with ${patient.name} is cancelled`,
    read: false,
    date: Date.now(),
  });
  await newNotification2.save();
  await sendEmail(
    patient.email,
    `Your appointment on ${date} has been cancelled by the doctor and the amount has been refunded to your wallet`
  );
  await sendEmail(
    doctore.email,
    `Your appointment on ${date} with ${patient.name} is cancelled`
  );
  
  res.status(200).json({ result: "done" });
}
```
#### Installation 

you can install the project using git clone 'https://github.com/advanced-computer-lab-2023/YKHO-Clinic.git' then run npm install to download all the needed packages for the backend and then navigate to frontend using cd frontend then run npm install to download all the needed packages for the frontend.

**Frontend Packages:**
- @emotion/react
- @emotion/styled
- @fontsource/roboto
- @mui/icons-material
- @mui/lab
- @mui/material
- @mui/x-date-pickers
- dayjs
- framer-motion
- luxon
- react
- react-dom
- react-router-dom
- socket.io-client
- @types/react
- @types/react-dom
- @vitejs/plugin-react
- eslint
- eslint-plugin-react
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- vite

**Backend Packages**
- axios
- bcrypt
- cookie-parser
- cors
- dotenv
- ejs
- express
- fs
- joi
- joi-browser
- joi-objectid
- joi-oid
- jsonwebtoken
- mongoose
- multer
- nodemailer
- nodemon
- pdfkit
- pdfkit-table
- socket.io
- stripe
- zlib

After cloning the project or downloading the ZIP folder open the project using the integrated terminal or by using the CMD then run the frontend / backend servers

nodemon app to run the backend server on port :3000
cd frontend npm start to run the frontend server on port :5173
#### Tests
sewar
######## API references
**Admin's Routes**

############ Login
```
    POST /login
```
| parameter | Type | Description
| ---------|----------| -------|
| username | string | admin's username |
| password | string | admin's password |

############ Logout
```
GET /logout
```

| parameter | Type | Description
| ---------|----------| -------|
| none | none | none |

############ Forget Password

```
POST /forgetPassword/enterUsername
```
| parameter | Type | Description
| ---------|----------| -------|
| username | string | user's username |

############ View Requests
```
GET /admin/uploadedInfo
```

| parameter | Type | Description
| ---------|----------| -------|
| none | none | none |

############ Retrieve Health Packages
```
GET /getHealthPackages
```
| parameter | Type | Description
| ---------|----------| -------|
| none | none | none |

######## Change Password Admin

**Route:** `/admin/changePasswordAdmin`

**Request type:** `POST`

**Request Body:**
```json
  "oldPassword": "currentPassword",
  "newPassword": "newPassword",
  "confirmationPassword": "newPassword"
```

######## Show Doctor Record

**Route:** `/admin/uploadedInfo/:id/:file`

**Request type:** `GET`

**Parameters:**
- `:id` (string): Doctor's ID.
- `:file` (string): Type of file to retrieve (`id`, `medicalLicense`, or `medicalDegree`).

######## Accept Request

**Route:** `/admin/acceptRequest`

**Request type:** `POST`

############ Function Parameters:

- `email` (string): Email of the doctor to be accepted.

######## Reject Request

**Route:** `/admin/rejectRequest`

**Request type:** `POST`

############ Function Parameters:

- `email` (string): Email of the doctor to be rejected.

######## Create Admin

**Route:** `/admin/register`

**Request type:** `POST`

############ Function Parameters:

- `username` (string): Admin's username.
- `password` (string): Admin's password.
- `email` (string): Admin's email.

######## Delete User

**Route:** `/admin/deleteUser`

**Request type:** `POST`

############ Function Parameters:

- `username` (string): Username of the user to be deleted.

######## Add Health Packages

**Route:** `/admin/healthPackages`

**Request type:** `POST`

############ Function Parameters:

- `packageName` (string): Name of the health package.
- `price` (number): Price of the health package.
- `doctorDiscount` (number): Discount offered by doctors for the health package.
- `pharmacyDiscount` (number): Discount offered by pharmacies for the health package.
- `familyDiscount` (number): Discount offered for family plans for the health package.

######## Update Health Packages

**Route:** `/admin/healthPackages/updated`

**Request type:** `POST`

**Middleware:** `requireAuthAdmin`

############ Function Parameters:

- `packageName` (string): Name of the health package to be updated.
- `price` (number): Updated price of the health package.
- `doctorDiscount` (number): Updated discount offered by doctors for the health package.
- `pharmacyDiscount` (number): Updated discount offered by pharmacies for the health package.
- `familyDiscount` (number): Updated discount offered for family plans for the health package.

######## Delete Health Package

**Route:** `/admin/healthPackages/deleted`

**Request type:** `POST`

############ Function Parameters:

- `packageName` (string): Name of the health package to be deleted.

**Doctor's Routes**
#### Add Doctor

- **URL:** 
  - `POST /addDoctor`

- **Function:**
  - `createDoctor`

- **Description:**
  - Creates a new doctor.

- **Parameters:**

| Parameter       | Type   | Description                |
|------------------|--------|----------------------------|
| name             | string | Doctor's name              |
| username         | string | Doctor's username          |
| password         | string | Doctor's password          |
| email            | string | Doctor's email             |
| speciality       | string | Doctor's speciality        |
| DOB              | date   | Doctor's Date of birth     |
| mobile           | string | Doctor's mobile            |
| rate             | number | Doctor's rate              |
| affiliation      | string | Doctor's affiliation       |
| education        | string | Doctor's education         |
| acceptedContract | bool   | Accepted contract status   |
| id               | image  | Doctor's ID                |
| medicalLicense   | image  | Doctor's medical license   |
| medicalDegree    | image  | Doctor's medical degree    |




#### Add Appointment

- **URL:** 
  - `POST /addAppointment`

- **Middleware:**
  - `requireAuthDoctor`

- **Parameters:**

| Parameter  | Type   | Description                |
|------------|--------|----------------------------|
| doctorID   | string | ID of the doctor            |
| patientID  | string | ID of the patient           |
| date       | date   | Date of the appointment     |
| status     | string | Status of the appointment   |


#### Create Prescription

- **URL:** 
  - `POST /doctor/addPrescription`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `createPrescription`

- **Description:**
  - Creates a new prescription for a patient.

- **Parameters:**

| Parameter           | Type   | Description                 |
|----------------------|--------|-----------------------------|
| name                 | string | Prescription name           |
| id                  | string | Patient ID                  |


#### Add Medicine to Prescription

- **URL:** 
  - `POST /doctor/addMedicine/:id`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `createMedicine`

- **Description:**
  - Adds a new medicine to a prescription.

- **Parameters:**

| Parameter  | Type   | Description               |
|------------|--------|---------------------------|
| id         | string | Prescription ID           |

- **Request:**
  - The request should include the following parameters in the request body:
    - `name` (string): Name of the medicine
    - `dosage` (string): Dosage information
    - `price` (number): Price of the medicine

#### Delete Medicine from Prescription

- **URL:** 
  - `POST /doctor/deleteMedicine`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `deleteMedicine`

- **Description:**
  - Deletes a medicine from a prescription.

- **Parameters:**

| Parameter  | Type   | Description               |
|------------|--------|---------------------------|
| id         | string | Prescription ID           |
| name       | string | Name of the medicine       |
| price      | number | Price of the medicine      |


#### Update Prescription Medicine

- **URL:** 
  - `POST /doctor/updatePrescMed`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `updateMedicine`

- **Description:**
  - Updates the dosage of a medicine in a prescription.

- **Parameters:**

| Parameter  | Type   | Description               |
|------------|--------|---------------------------|
| id         | string | Prescription ID           |
| name       | string | Name of the medicine       |
| dosage     | string | New dosage information     |



#### Update Prescription

- **URL:** 
  - `POST /doctor/updatePresc/:id`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `updatePresc`

- **Description:**
  - Updates prescription details.

- **Parameters:**

| Parameter         | Type   | Description                    |
|-------------------|--------|--------------------------------|
| id                | string | Prescription ID                |
| name (Optional)   | string | New prescription name           |
| filled (Optional) | bool   | New filled status for prescription |


#### Get Doctor Notifications

- **URL:** 
  - `POST /doctor/getNotifications`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `getNotificationsDoctor`

- **Description:**
  - Retrieves notifications for a doctor.

- **Parameters:**

| Parameter  | Type    | Description                |
|------------|---------|----------------------------|
| read       | boolean | Optional flag for marking notifications as read |


#### Change Doctor Password

- **URL:** 
  - `POST /doctor/edit/changePassword`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `changePasswordDoctor`

- **Description:**
  - Changes the password for a doctor.

- **Request:**
  - The request should include the following parameters in the request body:
    - `oldPassword` (string): Current password
    - `newPassword` (string): New password
    - `confirmationPassword` (string): Confirmation of the new password

#### Get Doctor's Patients

- **URL:** 
  - `GET /doctor/patients`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `showMyPatients`

- **Description:**
  - Retrieves a list of patients for a doctor.

- **Query Parameters:**
  - `name` (string, optional): Filters patients by name.
  - `upcoming` (boolean, optional): Filters patients by upcoming appointments.


#### Get Doctor's Patient Information

- **URL:** 
  - `GET /doctor/patients/:id`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `showMyPatientInfo`

- **Description:**
  - Retrieves detailed information about a specific patient for a doctor.

- **Parameters:**
  - `id` (string): Patient ID


#### Get Doctor's Upcoming Appointments

- **URL:** 
  - `GET /doctor/upcomingAppointments`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `showUpcomingAppointments`

- **Description:**
  - Retrieves a list of upcoming appointments for a doctor.


#### Update Doctor Information

- **URL:** 
  - `POST /doctor/updateInfo`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `updateThis`

- **Description:**
  - Updates specific information for a doctor.

- **Request:**
  - The request should include the following parameters in the request body:
    - `updateTerm` (string): The term to be updated (e.g., "email", "rate", "affiliation")
    - `updateValue` (string/number): The new value for the specified term

#### Get Doctor's Filtered Appointments

- **URL:** 
  - `GET /doctor/AppointmentsFilter`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `DocFilterAppointments`

- **Description:**
  - Retrieves a list of filtered appointments for a doctor.

- **Query Parameters:**
  - `date` (string, optional): Filters appointments by date.
  - `searchvalue` (string, optional): Filters appointments by status.
  - `filters` (string, optional): Filters appointments by type ("upcoming" or "past").

#### Get Doctor's Appointments

- **URL:** 
  - `GET /doctor/Appointments`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `DocShowAppointments`

- **Description:**
  - Retrieves a list of appointments for a doctor.

#### Check Doctor's Contract Status

- **URL:** 
  - `GET /doctor/contract`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `checkContract`

- **Description:**
  - Checks the contract status for a doctor.

- **Query Parameters:**
  - `accept` (string, optional): Acceptance status ("accept" to accept the contract).

#### Upload Patient Health Record PDF

- **URL:** 
  - `POST /doctor/patients/:id/upload-pdf`

- **Middleware:**
  - `requireAuthDoctor`
  
- **Function:**
  - `uploadHealthRecord`

- **Description:**
  - Uploads a health record PDF for a specific patient.

- **Parameters:**
  - `id` (string): Patient ID
  - `name` (string): Name of the health record

- **Request:**
  - Uses `multipart/form-data` encoding for file upload with a single file field named "healthRecords".

#### Get Doctor's Time Slots

- **URL:** 
  - `GET /doctor/timeSlots`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `showTimeSlots`

- **Description:**
  - Retrieves the time slots for a doctor.

#### Add Doctor's Time Slot

- **URL:** 
  - `POST /doctor/addTimeSlot`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `createTimeSlot`

- **Description:**
  - Adds a new time slot for a doctor.

- **Parameters:**
  - `day` (string): Day of the week (e.g., "Monday").
  - `from` (string): Starting time of the time slot.
  - `to` (string): Ending time of the time slot.

#### Delete Doctor's Time Slot

- **URL:** 
  - `GET /doctor/deleteTimeSlot/:id`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `deleteTimeSlot`

- **Description:**
  - Deletes a time slot for a doctor.

- **Parameters:**
  - `id` (string): ID of the time slot to be deleted.


#### Doctor's Schedule Follow-Up

- **URL:** 
  - `GET /doctor/schedFollowUp/:date`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `showFollowUp`

- **Description:**
  - Retrieves available time slots for scheduling a follow-up appointment on a specific date.

- **Parameters:**
  - `date` (string): Date for scheduling the follow-up appointment.

#### Doctor's Reserve Follow-Up

- **URL:** 
  - `POST /doctor/reserve`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `createFollowUp`

- **Description:**
  - Creates a follow-up appointment for a patient.

- **Parameters:**
  - `appointmentId` (string): ID of the original appointment for which the follow-up is being scheduled.
  - `date` (string): Date for scheduling the follow-up appointment.
  - `time` (string): Time slot for scheduling the follow-up appointment.


#### Doctor's Show Health Record

- **URL:** 
  - `GET /doctor/patients/:id/:healthId`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `showHealthRecord`

- **Description:**
  - Retrieves and displays a specific health record for a patient.

- **Parameters:**
  - `id` (string): ID of the patient.
  - `healthId` (string): Index or ID of the health record to be retrieved.

#### Doctor's View Wallet

- **URL:** 
  - `GET /doctor/Wallet`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `docViewWallet`

- **Description:**
  - Retrieves and displays the wallet details of the authenticated doctor.

#### Doctor's View Prescriptions

- **URL:** 
  - `GET /doctor/Prescriptions`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `ViewPrescriptionsDoc`

- **Description:**
  - Retrieves and displays the prescriptions created by the authenticated doctor for a specific patient.

- **Parameters:**
  - `id` (Query Parameter): ID of the patient for whom prescriptions are being viewed.

#### Doctor's Cancel Appointment

- **URL:** 
  - `POST /doctor/cancelAppointment`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `cancelAppointment`

- **Description:**
  - Cancels an appointment and handles the necessary refund and notifications.

- **Parameters:**
  - `id` (Request Body): ID of the appointment to be cancelled.

#### Check Logged In Status

- **URL:** 
  - `GET /loggedIn`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `loggedIn`

- **Description:**
  - Checks if a user is logged in and returns the login status along with the user type.

#### Get Doctor Name

- **URL:** 
  - `GET /doctor/name`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `getName`

- **Description:**
  - Retrieves the name of the authenticated doctor.

#### Reschedule Appointment

- **URL:** 
  - `POST /rescheduleAppointment`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `rescheduleAppointment`

- **Description:**
  - Reschedules a doctor's appointment.

- **Parameters:**
  - `appointmentId`: ID of the appointment to be rescheduled.
  - `date`: New date for the appointment.
  - `time`: New time range for the appointment.

#### Get Medicine

- **URL:**
  - `GET /doctor/getMedicine`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `getMedicine`

- **Description:**
  - Retrieves a list of medicines for a doctor.

#### Show Follow-Up Requests

- **URL:**
  - `GET /doctor/showRequests`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `ShowRequests`

- **Description:**
  - Retrieves follow-up requests for a doctor.

#### Accept Follow-Up Request

- **URL:**
  - `POST /doctor/acceptFollowUp`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `AcceptFollowupRequest`

- **Description:**
  - Accepts a follow-up request, creating an upcoming appointment for the patient.

- **Request Body:**
  - Requires the `id` of the follow-up request.

#### Reject Follow-Up Request

- **URL:**
  - `POST /doctor/rejectFollowUp`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `RejectFollowupRequest`

- **Description:**
  - Rejects a follow-up request, removing it from the doctor's pending requests.

- **Request Body:**
  - Requires the `id` of the follow-up request.

#### Download Prescription

- **URL:**
  - `GET /downloadPresc/:id`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `downloadPresc`

- **Description:**
  - Allows the patient to download a prescription in PDF format.

- **URL Parameters:**
  - `id`: Prescription ID.
  



 pateint

 Get Notifications

**Route:** `/patient/getNotifications`

**Request type:** `POST`

**Middleware:** `requireAuthPatient`

#### Function Parameters:

- `read` (boolean, optional): If provided and set to `true`, it marks all notifications as read.

 Delete Notification

**Route:** `/patient/deleteNotification`

**Request type:** `POST`

#### Function Parameters:

- `id` (string): ID of the notification to be deleted.

 Create Patient

**Route:** `/patient/createPatient`

**Request type:** `POST`

#### Function Parameters:

- `username` (string): Username for the patient.
- `password` (string): Password for the patient.
- `name` (string): Name of the patient.
- `DOB` (date): Date of birth of the patient.
- `gender` (string): Gender of the patient (`male`, `female`, `other`).
- `email` (string): Email address of the patient.
- `mobileNumber` (string): Mobile number of the patient (11 digits).
- `emergencyName` (string): Name of the emergency contact person.
- `emergencyMobile` (string): Mobile number of the emergency contact person (11 digits).

 Create Family Member

**Route:** `/patient/createFamilyMember`

**Request type:** `POST`

**Middleware:** `requireAuthPatient`

#### Function Parameters:

- `name` (string): Name of the family member.
- `nationalID` (string): National ID of the family member.
- `age` (number): Age of the family member.
- `relation` (string): Relation of the family member (`husband`, `son`, `daughter`, etc.).

 Read Family Members

**Route:** `/patient/readFamilyMembers`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Link Family Member

**Route:** `/patient/Linked`

**Request type:** `POST`

**Middleware:** `requireAuthPatient`

 Read User Data

**Route:** `/patient/home`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Search Doctors

**Route:** `/patient/searchDoctors`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Filter Doctors

**Route:** `/patient/filterDoctors`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Select Doctor

**Route:** `/patient/doctors/:id`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Pay by Credit

**Route:** `/patient/paymentcredit/:id`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

**Route:** `/patient/paymentcredit/:id`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

 Pay by Wallet

**Route:** `/patient/paymentWallet/:id`

**Request type:** `GET`

**Middleware:** `requireAuthPatient`

#### Subscription Successful

- **URL:**
  - `GET /subscriptionSuccessful/:healthPackage/:i`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `subscriptionSuccessful`

- **Description:**
  - Handles the successful subscription of a patient to a health package. Updates the patient's subscription information, including the health package, state, end date, and agent status.

- **URL Parameters:**
  - `healthPackage`: The health package to which the patient is subscribed.
  - `i`: Index of the family member (if applicable). Pass `-1` if not applicable.

#### Pay Prescription

- **URL:**
  - `GET /patient/paymentcreditpresc/:id`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `PayPresc`

- **Description:**
  - Handles the payment for a prescription by updating the patient's shopping cart with the prescribed medicines and marking the prescription as filled.

- **URL Parameters:**
  - `id`: Prescription ID.

#### Get Family Member Subscription

- **URL:**
  - `GET /patient/getFamilyMemberSub/:nationalID`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `readDetailsFamily`

- **Description:**
  - Retrieves the health package details of a family member associated with the patient.

- **URL Parameters:**
  - `nationalID`: National ID of the family member.

#### Delete Family Member Subscription

- **URL:**
  - `POST /patient/deleteFamilyMemberSubscription`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `deleteFamilyMemberSubscription`

- **Description:**
  - Cancels the subscription of a family member associated with the patient.

- **Request Method:**
  - `POST`

- **Request Body:**
  - `nationalID: ` National ID of the family member.

#### Delete Patient Subscription

- **URL:**
  - `GET /patient/deleteSubscription`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `deleteSubscription`

- **Description:**
  - Cancels the subscription of the patient.

#### Subscribe Family Member to Health Package

- **URL:**
  - `POST /patient/subscribeFamilyMember/:healthPackage`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `subscribeFamilyMember`

- **Description:**
  - Subscribes a family member to a health package using the specified payment method (wallet or card).

- **Request Method:**
  - `POST`

- **Parameters:**
  - `healthPackage` (URL parameter): The health package to subscribe the family member to.

- **Request Body:**
  - `nationalID`: National ID of the family member.
  - `paymentMethod`: Payment method (wallet or card).


#### Read Health Packages for Patient

- **URL:**
  - `GET /patient/readHealthPackages/:nationalID`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `readHealthPackages`

- **Description:**
  - Retrieves information about available health packages for a patient, considering any applicable discounts based on referral or existing subscriptions.

- **Request Method:**
  - `GET`

- **Parameters:**
  - `nationalID` (URL parameter): The national ID of the patient.

#### Subscribe Patient to Health Package

- **URL:**
  - `POST /patient/subscribe/:healthPackage`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `subscribe`

- **Description:**
  - Subscribes a patient to a health package using the specified payment method (wallet or card).

- **Request Method:**
  - `POST`

- **Parameters:**
  - `healthPackage` (URL parameter): The health package to subscribe the patient to.

- **Request Body:**
  - `paymentMethod`: Payment method (wallet or card).

- **Notes:**
  - If the payment method is "wallet," the patient is subscribed, and the wallet is updated accordingly.
  - If the payment method is "card," a Stripe Checkout session is created, and the user is redirected to complete the payment. The success and cancel URLs are specified in the Stripe Checkout session.


#### Read Health Package for Patient

- **URL:**
  - `GET /patient/readHealthPackage/:healthPackage`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `readHealthPackage`

- **Description:**
  - Retrieves information about a specific health package for a patient.

- **Request Method:**
  - `GET`

- **Parameters:**
  - `healthPackage` (URL parameter): The name of the health package.

#### Read Family Members Subscriptions for Patient

- **URL:**
  - `GET /patient/readFamilyMembersSubscriptions`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `readFamilyMembersSubscriptions`

- **Description:**
  - Retrieves information about the subscriptions of family members linked to the patient.

#### Read Subscription for Patient

- **URL:**
  - `GET /patient/readSubscription`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `readSubscription`

- **Description:**
  - Retrieves information about the patient's subscription.

#### Get Patient Information

- **URL:**
  - `GET /patient`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getPatient`

- **Description:**
  - Retrieves information about the authenticated patient.

- **Request Method:**
  - `GET`

#### Get Patient ID

- **URL:**
  - `GET /patient/getMyID`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getMyID`

- **Description:**
  - Retrieves the ID of the authenticated patient.

#### Add Follow-Up Request

- **URL:**
  - `POST /patient/addFollowUpRequest`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `addFollowUpRequest`

- **Description:**
  - Adds a follow-up request for a patient to a specific doctor at a given date and time.

- **Request Method:**
  - `POST`

- **Parameters:**
  - `doctorID` (String): ID of the doctor for the follow-up request.
  - `date` (Date): Date of the follow-up request.
  - `time` (String): Time range for the follow-up request in the format "HH:mm-HH:mm".
  - `id` (String): ID of the patient.

#### Reschedule Appointment (Patient)

- **URL:**
  - `POST /patient/rescheduleAppointment`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `rescheduleAppointment`

- **Description:**
  - Reschedules an appointment for a patient.

- **Request Method:**
  - `POST`

- **Parameters:**
  - `appointmentId` (String): ID of the appointment to be rescheduled.
  - `date` (Date): New date for the rescheduled appointment.
  - `time` (String): New time range for the rescheduled appointment in the format "HH:mm-HH:mm".

#### Get Time Slots on Date (Patient)

- **URL:**
  - `GET /patient/getTimeSlotOnDate`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getTimeSlotOnDate`

- **Description:**
  - Retrieves available time slots for a specific date and doctor.

- **Request Method:**
  - `GET`

- **Parameters:**
  - `date` (Date): Date for which time slots are requested.
  - `day` (Number): Day of the week (0 for Sunday, 1 for Monday, and so on).
  - `id` (String): ID of the doctor for whom time slots are requested.

#### Cancel Appointment (Patient)

- **URL:**
  - `POST /patient/cancelAppointment`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `cancelAppointmentPatient`

- **Description:**
  - Cancels a patient's appointment, updates the appointment status to "cancelled," and handles related actions such as refunding payment and sending notifications.

- **Request Method:**
  - `POST`

- **Request Body:**
  - `id` (String): ID of the appointment to be cancelled.


#### Get Doctor Specialities

- **URL:**
  - `GET /patient/doctorSpecialities`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getDoctorSpeciality`

- **Description:**
  - Retrieves the list of available doctor specialities.

#### View Prescription PDF

- **URL:**
  - `GET /patient/prescriptionPDF/:id`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `viewPrescriptionPDF`

- **Description:**
  - Retrieves and sends the prescription PDF for viewing or download.

- **Request Method:**
  - `GET`

- **Parameters:**
  - `:id` (Prescription ID)

#### View All Prescription Information

- **URL:**
  - `GET /patient/AllPresecrptionsInfo`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `viewAllDataOfPrescriptions`

- **Description:**
  - Retrieves and sends information about all prescriptions associated with the authenticated patient.

#### Get Upcoming Appointments

- **URL:**
  - `GET /patient/appointmentsCards`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getMyAppointments`

- **Description:**
  - Retrieves and sends information about upcoming appointments for the authenticated patient.

#### Get Family Members' Health Plans

- **URL:**
  - `GET /patient/familyMembersPlans`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getFamilyMembersPlan`

- **Description:**
  - Retrieves and sends information about the health plans of the authenticated patient's family members.

#### Get Patient Health Plan

- **URL:**
  - `GET /patient/plan`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `getPatientPlan`

- **Description:**
  - Retrieves and sends information about the health plan of the authenticated patient.

#### Reserve Slot for Family Member

- **URL:**
  - `GET /patient/doctors/:id/familyMember/reserve`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `reserveSlotFam`

- **Description:**
  - Reserves an appointment slot for a family member with a specified doctor.

- **Query Parameters:**
  - `id`: Doctor ID
  - `date`: Appointment date (in the format YYYY-MM-DD)
  - `time`: Appointment time slot (in the format startHour:startMinute,endHour:endMinute)
  - `famID`: Family member ID

#### Show Slots for Family Member

- **URL:**
  - `GET /patient/doctors/:id/showSlots/familyMember`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `showSlotsFam`

- **Description:**
  - Displays available time slots for a specified doctor, allowing the patient to reserve slots for family members.

- **Parameters:**
  - `id`: Doctor ID

- **Query Parameters:**
  - `date`: Appointment date (in the format YYYY-MM-DD)

#### Reserve Slot

- **URL:**
  - `GET /patient/doctors/:id/reserve`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `reserveSlot`

- **Description:**
  - Reserves a time slot for a specified doctor, allowing the patient to schedule an appointment.

- **Request Method:**
  - `GET`

- **Parameters:**
  - `id`: Doctor ID

- **Query Parameters:**
  - `id`: Family member ID (optional)
  - `date`: Appointment date (in the format YYYY-MM-DD)
  - `time`: Appointment time range (e.g., "10:00,11:00")

#### Show Slots

- **URL:**
  - `GET /patient/doctors/:id/showSlots`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `showSlots`

- **Description:**
  - Displays available time slots for a specified doctor, allowing the patient to choose a suitable time for scheduling an appointment.


- **Parameters:**
  - `id`: Doctor ID

- **Query Parameters:**
  - `date`: Appointment date (in the format YYYY-MM-DD, optional)


#### Failure Endpoint

- **URL:**
  - `GET /fail`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `fail`

- **Description:**
  - Redirects to a specified URL indicating a failure status, typically used in payment failure scenarios.


#### Success Endpoint

- **URL:**
  - `GET /success/:id`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `success`

- **Description:**
  - Handles the success scenario after a successful appointment payment. Updates the doctor's wallet and sets the appointment status to paid.

- **Parameters:**
- `id`: Appointment ID

#### View Wallet Endpoint

- **URL:**
  - `GET /patient/Wallet`

- **Middleware:**
  - `requireAuthPatient`

- **Function:**
  - `ViewWallet`

- **Description:**
  - Retrieves and returns the wallet balance of the authenticated patient.

  get /patient/Prescriptions
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| name                | string | Prescription name           |
| id                  | string | Patient ID                  |
| id                  | string | User ID                     |

get /patient/PrescriptionsFiltered
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                | string | Patient ID           |
| doctorName                  | string | regex                 |
| patientID                  | string | User ID                     |
| temp                  | string | Date                    |

get /patient/Prescriptions/:id
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| patient                | string | Patient ID           |
| result                  | string | Patient ID                  |

get /Patient/Appointments
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                | string | Patient ID           |

post /patient/changePassword
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| oldPassword                | string | Old Password          |
| newPassword                  | string | New Password                  |
| confirmationPassword                  | string | Confirmation Password                     |
| username                  | string | User username     |

get /patient/AppointmentsFilter
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| date                  | date | date                 |
| searchvalue                  | string | Search Value           |
| filters=="upcoming"          | string | Filter by upcoming |
| filters=="past"              | string | Filter by past|

get /patient/HealthRecords
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |

post /patient/addMedicalHistory
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| name                  | string | Doctor Name                 |
| document                  | string | file buffer           |
| user                 | string | Patient Username  |

get /files/:fileId
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| fileId                  | string | File ID                 |
| id                  | string | Patient ID          |

post /patient/deleteMedicalHistory/:id
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |
| index                  | string | id of each Health Record     |

get /patient/Prescriptions
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                 | string | Patient ID                |

get /Patient/PrescriptionsFiltered
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |
| doctor                 | string | doctor name     |

get /patient/Prescriptions/:id
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |
| id                 | string | Prescription ID     |

get /Patient/Appointments/:id
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Appointments ID          |

get /Patient/AppointmentsFilter
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |
| id                 | string | Patient ID     |
| date                | string | date    |
| searchvalue                 | string | Search Value     |

get /patient/HealthRecords
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |

get /patient/medicalHistory/:index
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| user                  | string | Patient User                |
| index                 | string | id of each Medical History      |

get /files/:fileId
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| fileId                  | string | File ID                |
| user                 | string | Patient User      |

post /patient/deleteMedicalHistory
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| id                  | string | Patient ID                |
| index                 | string | Medical History ID      |

post /request/createRequest
| Parameter           | Type   | Description                 |
|---------------------|--------|-----------------------------|
| Username                  | string | Future Doctor ID     |
| Password                 | string | Future Doctor Password       |
| Name                 | string | Future Doctor Name       |
| DOB                 | string | Future Doctor DOB       |
| Email                 | string | Future Doctor Email       |
| Speciality                 | string | Future Doctor Speciality       |
| mobile                 | string | Future Doctor mobile       |
| rate                 | string | Future Doctor rate       |
| affiliation                 | string | Future Doctor affiliation       |
| education                 | string | Future Doctor education       |

#### Chats Endpoint

- **URL:**
  - `GET /chats`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `chats`

- **Description:**
  - Retrieves and returns the chat rooms and messages associated with the authenticated user (patient or doctor).


json
Copy code
#### Send Message Endpoint

- **URL:**
  - `POST /text`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `send`

- **Description:**
  - Adds a new message to a chat room and returns the updated chat information.

- **Request Body:**
  - JSON object containing:
    - `room`: Chat room identifier.
    - `text`: Message content.
    - `time`: Time when the message was sent (formatted as a string).

#### Read Message Endpoint

- **URL:**
  - `POST /read`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `read`

- **Description:**
  - Marks unread messages in a chat room as read and returns the updated chat information.

- **Request Method:**
  - `POST`

- **Parameters:**
  - None

- **Request Body:**
  - JSON object containing:
    - `room`: Chat room identifier.


#### Start Chat Endpoint

- **URL:**
  - `POST /start`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `start`

- **Description:**
  - Initializes a new chat room between a patient and a doctor and returns the chat information.


- **Request Body:**
  - JSON object containing:
    - `room`: Unique identifier for the chat room. It can be generated using the patient and doctor IDs.
    - `patientID`: Patient's user ID.
    - `doctorID`: Doctor's user ID.

#### Contacts Endpoint

- **URL:**
  - `GET /contacts`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `contacts`

- **Description:**
  - Retrieves a list of contacts (chats) for a patient or doctor.

#### Unread Messages Endpoint

- **URL:**
  - `GET /unread`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `unread`

- **Description:**
  - Retrieves the total number of unread messages for a patient or doctor.

#### Rooms Endpoint

- **URL:**
  - `GET /rooms`

- **Middleware:**
  - `requireAuth`

- **Function:**
  - `rooms`

- **Description:**
  - Retrieves a list of rooms associated with appointments for a patient or doctor.

- **Request Method:**
  - `GET`

## Pharmacist Read Endpoint

- **URL:**
  - `GET /pharmacistRead`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `pharmacistRead`

- **Description:**
  - Marks pharmacist messages as read for a doctor in a pharmacist chat.



## Pharmacist Read Endpoint

- **URL:**
  - `GET /pharmacistRead`

- **Middleware:**
  - `requireAuthDoctor`

- **Function:**
  - `pharmacistRead`

- **Description:**
  - Marks pharmacist messages as read for a doctor in a pharmacist chat.

#### Features
we have three main users in our website

##### Starting Page

This is the starting screen if youre not logged in , you can forget your pass , register as a doctor and register as a patient or login
![image](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/4b330434-cf81-441c-8150-1ead95cc1b4a)

This is the forget password , you write your username and you get an email on your email address
![image2](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/09663656-fe9b-41fb-94aa-6ca8b52f54af)

This is the register doctor page
![image3](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/b3551484-ecf2-472f-a09c-f6685e0270a7)

This is the register patient page
![image4](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/8aa1f1b6-c85b-4a0d-8670-08aa712c7eb7)

##### Admin page

This is the admin home page, it contains the doctor requests and the health packages
![image5](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/d9be7fe5-5990-4564-b1d2-a101921bf306)

This is the edit users page where you can remove a user and create a new admin
![image6](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/0fcc5a64-4f65-4008-8f04-426a8c2b9b85)

This is the doctor requests
![image7](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/c6ef8b2e-8018-4b9c-b42c-ba805b447da7)

This is the health packages page , you can view health packages , edit health packages and add new health packages
![image8](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/96f189eb-72fd-4ccd-bb08-deb9c0ed45cd)

This is where you change your password
![image9](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/17f6e9df-268b-478e-a9fb-86b1c3c4e504)

##### Doctor page

This is the doctor home page , you can view general information about the doctor like upcoming appointments , your wallet and followup requests
you can click view all to see more
![image10](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/d3c1dbcd-b205-40d6-bbe2-c20d69325e84)

This is the doctor patients page, you view your patient general information by clicking view more and you can search by name or whether the patient has an upcoming appointment
![image11](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/442ecfb8-f9ef-4c64-ba5c-19aae6386b33)

This is what happens when you click view more on the patient in the previous page, you have a view health records button to show the patients health record and a view prescriptions button to show the patients prescriptions
![image12](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/2da58bcd-20a6-48a8-aa33-f2fd8c789b1d)

This is what happens when you click the view prescriptions button , you see the patients prescriptions , you can add a new one and edit or download old ones
![image13](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/19adf430-a784-43e0-bf6d-26e32681c4f1)

This is what you see when you edit a prescription, you can add a new medication from the pharmacy side of the database and edit the dosage of the medicine or remove the medicine
![image14](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/eac6bfdd-ff8d-4ff9-8d0b-0cbeb09b7b72)

This is what happens when you click the view health records button , you can upload new health records and you can also download health records
![image15](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/2355002f-115c-4586-918a-e27834c609ce)

This is the Chat ui where you can add new chats
![chat](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/b3d851c6-0ca4-4a32-b8ee-cdffc5d9fe5b)

This is what happens when you add new chat , you can select one of your patients to chat with
![image16](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/3ca5f2ff-07a0-4324-b795-7fe21f27cfce)

This is what happens when you chat with a patient you added
![image17](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/7ffd57c7-83a8-4c84-9c1b-f3c0e4155154)
This is what happens you call a patient , you wait for the other side to answer the call
![image18](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/1afc71a1-44fc-40f2-a4de-ed9e855362ab)
This is the doctor follow up page where you can accept or reject a follow up a patient made
![image19](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/c8758ff0-7071-409e-b3a5-da7a4dcb14a5)

This is the doctor edit info page , you can change your email , rate or affiliation or you can change your password
![image20](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/41393387-0c45-4b06-8157-c3ec66b81327)

This is the notification bar
![image21](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/916dcf79-173c-4c58-b27d-8256e08fce5f)
This is the burger menu
![image22](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/d56d057d-8488-47cf-8b80-c207a05c1629)
This is the doctor appointments page , you can filter by the status, date or whether its upcoming or a past appointment, you can also reschedule, cancel or do a followup if its completed
![image23](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/e3e65c3c-ea1d-4d73-92f9-ff1a0041a047)
This is the doctor timeSlots page , you can add a new timeslot if its not clashing and view your already created time slots
![image24](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/100940677/a954f869-97c8-4e04-8dc7-8c575b9ea794)

#### Tests
![sd](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/58986797/d72837da-2bd9-43ac-bc1e-9b95df69a487)

![jjj](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/58986797/fd46db25-3395-4f3b-b917-ffb166519672)

![image](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/assets/58986797/84bdefd9-8129-4dd6-99c8-3e23fbdbe99c)



#### How to use
You can use our website as one of three main users (Admin , Doctor, or Patient), you can sign up for an account from the sign up page and login to the website as a patient or if you are a doctor, you will submit a request which will be revised by the admin or if you are an admin the company will create an account for you in its own then you can login and change your password and use our features.
#### Contribute

We welcome contributions from the community! If you'd like to contribute to this project, please follow these guidelines:

###### Issues

If you find a bug, have a feature request, or want to discuss something related to the project, please check the [Issues](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/issues) section. If the issue doesn't already exist, feel free to open a new one.

###### Pull Requests

We appreciate pull requests! Before submitting a pull request, please make sure to:

1. Fork the repository and create your branch from `main`.
2. Make your changes and ensure they adhere to the project's coding style.
3. Test your changes thoroughly to ensure they work as expected.
4. Update the documentation if necessary.
5. Ensure your code passes the existing tests.

###### How to submit a Pull Request

1. Fork the project.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to your fork: `git push origin feature-name`.
5. Submit a pull request to the `main` branch of the original repository.



#### Credits
- [mongoDb docs](https://www.mongodb.com/docs/manual/introduction/)
- [Material UI](https://www.youtube.com/watch?v=Xoz31I1FuiY)
- [React](https://www.youtube.com/watch?v=hQAHSlTtcmY)
- [Node.Js](https://www.youtube.com/watch?v=TlB_eWDSMt4)

#### License

This project is licenced under [Apache license 2.0](https://github.com/advanced-computer-lab-2023/YKHO-Clinic/blob/main/License.txt)


