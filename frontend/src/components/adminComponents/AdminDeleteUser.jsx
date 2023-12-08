import { React, useState } from "react";
import axios from "axios";

export default function AdminDeleteUser() {
  const [error, setError] = useState("");

  async function deleteUserButton() {
    let username = document.getElementsByName("username")[0].value;
    let type = document.getElementsByName("userType")[0].value;

    await axios
      .post(
        "http://localhost:3000/admin/deleteUser",
        {
          username: username,
          userType: type,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.message == "User deleted successfully")
          document.getElementsByName("username")[0].value = "";
        setError(res.data.message);
      });
  }

  return (
    <div>
      <label for="userType">Choose which type of user</label>
      <select name="userType" id="users">
        <option value="doctor">doctor</option>
        <option value="admin">admin</option>
        <option value="patient">patient</option>
      </select>
      <br />
      <br />
      <label for="username">Username</label>
      <input name="username" type="text" />
      <button onClick={deleteUserButton} type="submit">
        delete
      </button>
      <p>{error}</p>
    </div>
  );
}
