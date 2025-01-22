#include "clients_addressesTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

client_addressesTable::client_addressesTable(sql::Connection* conn):connection(conn){};

int client_addressesTable::add_client_addresses(nlohmann::json& json) {
    // Check if the input JSON contains the expected key
    if (!json.contains("client_addresses") || !json["client_addresses"].is_array()) {
        std::cout << "Error: 'addresses' key is missing or is not an array" << std::endl;
        return false;
    }
    bool valid = false;
    auto addresses = json["client_addresses"];
    std::cout << addresses <<std::endl;
    for (const auto& item : addresses) {
        std::string address;
        int clientId;

        // Validate and extract `client_address` and `client_id`
        if (item.contains("client_address")) {
            address = item["client_address"];
        } else {
            std::cout << "Error: 'client_address' is missing or invalid in one of the entries." << std::endl;
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
                INSERT INTO client_addresses (address, client_id)
                VALUES (?, ?)
            )"));
            pstmt->setString(1, address);
            pstmt->setInt(2, clientId);
            valid = pstmt->execute();

            std::cout << "Inserted address: " << address << " for client_id: " << clientId << std::endl;
        } catch (const sql::SQLException& e) {
            std::cerr << "SQL Error: " << e.what() << " (Code: " << e.getErrorCode() << ")" << std::endl;
        }
    }
    int lastInsertedClientAddress = 0;
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastInsertedClientAddress = res->getInt(1);
        std::cout << "lastInsertedClientAddress ID" << lastInsertedClientAddress << std::endl;
    }
    return lastInsertedClientAddress;
}




nlohmann::json client_addressesTable::get_client_addresses(nlohmann::json& json) {
   nlohmann::json client_addresses = nlohmann::json::array();
    int clientId;
     std::cout << json<<std::endl;
    // Check if the client_id is present in the JSON
    if (json.contains("client_id")) {
        clientId = json["client_id"];
    } else {
        std::cout << "client_id field is empty" << std::endl;
        return client_addresses;
    }

    try {
        
        std::unique_ptr<sql::PreparedStatement> stmt(connection->prepareStatement(
            "SELECT id, address FROM client_addresses WHERE client_id = ?"
        ));

        // Bind the client_id parameter
        stmt->setInt(1, clientId);

        // Execute the query
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery());

        // Process the results
        while (res->next()) {
            nlohmann::json entry = {
                {"id", res->getInt("id")},
                {"address", res->getString("address")}
            };
            client_addresses.push_back(entry);
        }
        std::cout << client_addresses << std::endl;
    } catch (sql::SQLException &e) {
        std::cout << "Error executing query: " << e.what() << std::endl;
    }
    
    return client_addresses;
}




bool client_addressesTable::update_client_address(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string updatedAddress;
    int clientAddressId;
    
    if(json.contains("updated_address")){
        updatedAddress = json["updated_address"];
    }else{
        std::cout << "updated_address is empty" << std::endl;
        
    }
    if(json.contains("address_id")){
        clientAddressId = json["address_id"];
    }else{
        std::cout << "address_id is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE client_addresses
    SET address = ?
    WHERE id = ?
)"));

   
    pstmt->setString(1, updatedAddress);
    pstmt->setInt(2, clientAddressId);
    bool valid = pstmt->execute();
    return !valid;
}

bool client_addressesTable::delete_client_address(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int client_addressesId;

    if (json.contains("address_id")) {
        client_addressesId = json["address_id"];
    } else {
        std::cout << "client_addressesId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM client_addresses
        WHERE id = ?
    )"));

    pstmt->setInt(1, client_addressesId); 

        bool valid = pstmt->execute();
        return !valid;
    }

