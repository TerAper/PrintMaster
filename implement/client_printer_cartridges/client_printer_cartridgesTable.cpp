#include "client_printer_cartridgesTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

client_printer_cartridgesTable::client_printer_cartridgesTable(sql::Connection* conn):connection(conn){};

bool client_printer_cartridgesTable::add_client_printer_cartridge(nlohmann::json& json) {
    if (!json.is_array()) {
        std::cout << "Expected an array of cartridges, but got: " << json.dump(4) << std::endl;
        return false;
    }
    bool confirm = true;
    for (const auto& cartridge : json) {
        int cartridge_id = 0;
        int client_printer_id = 0;
        std::string description;

        if (cartridge.contains("cartridge_id") && cartridge["cartridge_id"].is_number_integer()) {
            cartridge_id = cartridge["cartridge_id"];
        } else {
            std::cout << "cartridge_id is missing or invalid for cartridge: " << cartridge.dump(4) << std::endl;
            continue;
        }

        if (cartridge.contains("client_printer_id") && cartridge["client_printer_id"].is_number_integer()) {
            client_printer_id = cartridge["client_printer_id"];
        } else {
            std::cout << "client_printer_id is missing or invalid for cartridge: " << cartridge.dump(4) << std::endl;
            continue;
        }

        if (cartridge.contains("description") && cartridge["description"].is_string()) {
            description = cartridge["description"];
        } else {
            description = "";  // Handle as empty if it's not present
        }

        // Insert into the database
        try {
            std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
                INSERT INTO client_printer_cartridge (client_printer_id, cartridge_id, description)
                VALUES (?, ?, ?)
            )"));

            pstmt->setInt(1, client_printer_id);
            pstmt->setInt(2, cartridge_id);

            if (description.empty()) {
                pstmt->setNull(3, sql::DataType::VARCHAR);
            } else {
                pstmt->setString(3, description);
            }

            int rowsAffected = pstmt->executeUpdate();
            if (rowsAffected > 0) {
                std::cout << "Inserted cartridge: " << cartridge.dump(4) << std::endl;
            } else {
                confirm = false;
                std::cout << "Failed to insert cartridge: " << cartridge.dump(4) << std::endl;
            }
        } catch (const sql::SQLException& e) {
            std::cout << "SQL Exception: " << e.what() << std::endl;
            std::cout << "SQLState: " << e.getSQLState() << std::endl;
            std::cout << "Error Code: " << e.getErrorCode() << std::endl;
        }
    }
    return confirm;
}



nlohmann::json client_printer_cartridgesTable::get_client_printer_cartridges(nlohmann::json& json) {
    nlohmann::json client_printer_cartridges = nlohmann::json::array();
    
    int client_printer_id;

    // Validate JSON input
    if (json.contains("client_printer_id") && !json["client_printer_id"].is_null()) {
        client_printer_id = json["client_printer_id"];
    } else {
        std::cerr << "client_printer_id is missing or null." << std::endl;
        return nlohmann::json::array();
    }

    try {
        if (!connection || connection->isClosed()) {
            throw std::runtime_error("Database connection is not valid or is closed.");
        }

        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            SELECT 
                cpc.id AS client_printer_cartridge_id,
                cpc.description AS client_printer_cartridge_description,
                cpc.cartridge_id AS cartridge_id,
                c.name AS cartridge_name
            FROM 
                client_printer_cartridge cpc
            JOIN 
                cartridges c ON cpc.cartridge_id = c.id
            WHERE 
                cpc.client_printer_id = ?;
        )"));
        pstmt->setInt(1, client_printer_id);

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());

        bool hasResults = false;
        while (res->next()) {
            hasResults = true;
            nlohmann::json client_printer_cartridge;
            client_printer_cartridge["cartridge_name"] = res->getString("cartridge_name");
            client_printer_cartridge["client_printer_cartridge_description"] = res->getString("client_printer_cartridge_description");
            client_printer_cartridge["client_printer_cartridge_id"] = res->getInt("client_printer_cartridge_id");
            client_printer_cartridge["cartridge_id"] = res->getInt("cartridge_id");

            client_printer_cartridges.push_back(client_printer_cartridge);
        }

        if (!hasResults) {
            std::cout << "No results found for client_printer_id: " << client_printer_id << std::endl;
            nlohmann::json  response= {{"status", "failure"}, {"message", "No results found"}};
            client_printer_cartridges.push_back(response);
        }

    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() 
                  << " (SQLState: " << e.getSQLState() << ", ErrorCode: " << e.getErrorCode() << ")"
                  << "\nQuery failed for client_printer_id: " << client_printer_id << std::endl;
    } catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    }

    return client_printer_cartridges;
}


bool client_printer_cartridgesTable::update_client_printer_cartridge(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string name;
    std::string phone_number;
    std::string address;
    std::string llc;
    int client_printer_cartridgeId;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
    if(json.contains("phone_number")){
        phone_number = json["phone_number"];
    }else{
        std::cout << "Phone_number is empty" << std::endl;
       
    }
    if(json.contains("address")){
        address = json["address"];
    }else{
        std::cout << "Adderess is empty" << std::endl;
       
    }
    if(json.contains("llc")){
        llc = json["llc"];
    }else{
        std::cout << "LLC is empty" << std::endl;
        
    }
    if(json.contains("id")){
        client_printer_cartridgeId = json["id"];
    }else{
        std::cout << "client_printer_cartridgeId is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE client_printer_cartridges
    SET name = ?, phone_number = ?, address = ?, llc = ?
    WHERE id = ?
)"));

    pstmt->setString(1, name);              // Set the name
    pstmt->setString(2, phone_number);      // Set the phone number
    pstmt->setString(3, address);           // Set the address
    pstmt->setString(4, llc);               // Set the LLC             
    pstmt->setInt(5, client_printer_cartridgeId);             // Set the id (to match the row to be updated)
    bool valid = pstmt->execute();
        return !valid;
}

bool client_printer_cartridgesTable::delete_client_printer_cartridge(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int clientPrinterCartridgeId;

    if (json.contains("client_printer_cartridge_id")) {
        clientPrinterCartridgeId = json["client_printer_cartridge_id"];
    } else {
        std::cout << "client_printer_cartridgeId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM client_printer_cartridge
        WHERE id = ?
    )"));

    pstmt->setInt(1, clientPrinterCartridgeId); 

        bool valid = pstmt->execute();
        return !valid;
    }

