import adminSeeder from "./adminSeeder";

const adminData = {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith",
    email: "",
    password: "",
    contact: "123-456-7890",
    roles: [""]
};

adminSeeder.execute(adminData);
