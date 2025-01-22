#include "clients_phone_numbersTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

client_phone_numbersTable::client_phone_numbersTable(sql::Connection* conn):connection(conn){};

int client_phone_numbersTable::add_client_phone_numbers(nlohmann::json& json) {
    // Check if the input JSON contains the expected key
    if (!json.contains("phone_numbers")) {
        std::cout << "Error: 'phone_numbers' key is missing or is not an array" << std::endl;
        return false;
    }
    bool valid = false;
    auto phoneNumbers = json["phone_numbers"];
    std::cout << phoneNumbers << std::endl;
    for (const auto& item : phoneNumbers) {
        std::string phoneNumber;
        int clientId;
        
        if (item.contains("phone_number")) {
            phoneNumber = item["phone_number"];
            std::cout << "phoneNumber" <<phoneNumber<<'\n';
        } else {
            std::cout << "Error: 'phone_number' is missing or invalid in one of the entries." << std::endl;
            continue;
        }

        if (item.contains("client_id")) {
            clientId = item["client_id"];
        } else {
            std::cout << "Error: 'client_id' is missing or invalid in one of the entries." << std::endl;
            continue;
        }

        // Insert into the database
        try {
            std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
                INSERT INTO client_phone_numbers (phone_number, client_id)
                VALUES (?, ?)
            )"));
            pstmt->setString(1, phoneNumber);
            pstmt->setInt(2, clientId);
            valid = pstmt->execute();

            std::cout << "Inserted phone_number: " << phoneNumber << " for client_id: " << clientId << std::endl;
        } catch (const sql::SQLException& e) {
            std::cerr << "SQL Error: " << e.what() << " (Code: " << e.getErrorCode() << ")" << std::endl;
        }
    }
    int lastInsertedClientPhoneNumber = 0;
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastInsertedClientPhoneNumber = res->getInt(1);
        std::cout << "lastInsertedClientPhoneNumber ID" << lastInsertedClientPhoneNumber << std::endl;
    }
    return lastInsertedClientPhoneNumber;
}



#include <iostream>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <nlohmann/json.hpp>

nlohmann::json client_phone_numbersTable::get_client_phone_numbers(nlohmann::json& json) {
    nlohmann::json client_phone_numbers = nlohmann::json::array();
    int clientId;
    std::cout << json<<std::endl;
    // Check if the client_id is present in the JSON
    if (json.contains("client_id")) {
        clientId = json["client_id"];
    } else {
        std::cout << "client_id field is empty" << std::endl;
        return client_phone_numbers;
    }

    try {
        
        // Prepare the SQL query
         std::unique_ptr<sql::PreparedStatement> stmt(connection->prepareStatement(
            "SELECT id, phone_number FROM client_phone_numbers WHERE client_id = ?"
        ));

        // Bind the client_id parameter
        stmt->setInt(1, clientId);

        // Execute the query
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery());

        // Process the results
        while (res->next()) {
            nlohmann::json entry = {
                {"id", res->getInt("id")},
                {"phone_number", res->getString("phone_number")}
            };
            client_phone_numbers.push_back(entry);
        }
    } catch (sql::SQLException &e) {
        std::cout << "Error executing query: " << e.what() << std::endl;
    }
    
    return client_phone_numbers;
}





bool client_phone_numbersTable::update_client_phone_number(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string updatedPhoneNumber;
    int clientPhoneNumberId;
    
    if(json.contains("updated_phone_number")){
        updatedPhoneNumber = json["updated_phone_number"];
    }else{
        std::cout << "updated_phone_number is empty" << std::endl;
        
    }
    if(json.contains("phone_number_id")){
        clientPhoneNumberId = json["phone_number_id"];
    }else{
        std::cout << "phone_number_id is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE client_phone_numbers
    SET phone_number = ?
    WHERE id = ?
)"));

   
    pstmt->setString(1, updatedPhoneNumber);
    pstmt->setInt(2, clientPhoneNumberId);
    bool valid = pstmt->execute();
    return !valid;
}

bool client_phone_numbersTable::delete_client_phone_number(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int client_phone_numbers_id;

    if (json.contains("phone_id")) {
        client_phone_numbers_id = json["phone_id"];
    } else {
        std::cout << "client_phone_numbersId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM client_phone_numbers
        WHERE id = ?
    )"));

    pstmt->setInt(1, client_phone_numbers_id); 

        bool valid = pstmt->execute();
        return !valid;
    }

