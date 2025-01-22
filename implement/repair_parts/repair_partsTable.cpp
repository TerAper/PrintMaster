#include "repair_partsTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

repair_partsTable::repair_partsTable(sql::Connection* conn):connection(conn){};

int repair_partsTable::add_repair_part(nlohmann::json& json) {
    
    bool confirm = true;
        std::string category;
        std::string name;
        std::string description;
        int price = 0;
        int spend = 0;

        if (json.contains("category")) {
            category = json["category"];
        } else {
            std::cout << "category is missing : " << std::endl;
        }
        if (json.contains("name")) {
            name = json["name"];
        } else {
            std::cout << "name is missing : " << std::endl;
        }if (json.contains("price")) {
            price = json["price"];
        } else {
            std::cout << "price is missing : " << std::endl;
        }
        if (json.contains("spend")) {
            spend = json["spend"];
        } else {
            std::cout << "spend is missing : " << std::endl;
        }
        if (json.contains("description")) {
            description = json["description"];
        } else {
            std::cout << "description is missing : " << std::endl;
        }

        bool valid = true;
        int lastInsertedRepairPartId = 0;
        try {
            std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
                INSERT INTO repair_parts (category, name, description,price,spend)
                VALUES (?, ?, ?, ?, ?)
            )"));

            pstmt->setString(1, category);
            pstmt->setString(2, name);
            pstmt->setString(3, description);
            pstmt->setInt(4, price);
            pstmt->setInt(5, spend);
            valid = pstmt->execute();
            if (!valid) {
            std::unique_ptr<sql::Statement> stmt(connection->createStatement());
            std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
                if (res->next()) {
                    lastInsertedRepairPartId = res->getInt(1);
                    std::cout << "lastInsertedRepairPartId ID = " << lastInsertedRepairPartId << std::endl;
                }
            } else {
                std::cerr << "Failed to insert printer data" << std::endl;
            }
        } catch (const sql::SQLException& e) {
            std::cout << "SQL Exception: " << e.what() << std::endl;
            std::cout << "SQLState: " << e.getSQLState() << std::endl;
            std::cout << "Error Code: " << e.getErrorCode() << std::endl;
        }
    
    return lastInsertedRepairPartId;
}



nlohmann::json repair_partsTable::get_repair_parts(nlohmann::json& json) {
    nlohmann::json repair_parts = nlohmann::json::array();
    
    std::string category;

    // Validate JSON input
    if (json.contains("category")) {
        category = json["category"];
    } else {
        std::cerr << "category is missing or null." << std::endl;
        return nlohmann::json::array();
    }

    try {
        if (!connection || connection->isClosed()) {
            throw std::runtime_error("Database connection is not valid or is closed.");
        }

        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            SELECT * FROM repair_parts
            WHERE 
                category = ?;
        )"));
        pstmt->setString(1, category);

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());

        bool hasResults = false;
        while (res->next()) {
            hasResults = true;
            nlohmann::json repair_part;
            repair_part["category"] = res->getString("category");
            repair_part["name"] = res->getString("name");
            repair_part["description"] = res->getString("description");
            repair_part["price"] = res->getInt("price");
            repair_part["spend"] = res->getInt("spend");
            repair_part["id"] = res->getInt("id");

            repair_parts.push_back(repair_part);
        }

        if (!hasResults) {
            std::cout << "No results found for catecory: " << category << std::endl;
            nlohmann::json  response= {{"status", "failure"}, {"message", "No results found"}};
            repair_parts.push_back(response);
        }

    } catch (sql::SQLException& e) {
        std::cerr << "SQL Error: " << e.what() 
                  << " (SQLState: " << e.getSQLState() << ", ErrorCode: " << e.getErrorCode() << ")"
                  << "\nQuery failed for catecory: " << category << std::endl;
    } catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    }

    return repair_parts;
}


bool repair_partsTable::update_repair_part(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string name;
    std::string phone_number;
    std::string address;
    std::string llc;
    int repair_partId;

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
        repair_partId = json["id"];
    }else{
        std::cout << "repair_partId is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE repair_parts
    SET name = ?, phone_number = ?, address = ?, llc = ?
    WHERE id = ?
)"));

    pstmt->setString(1, name);              // Set the name
    pstmt->setString(2, phone_number);      // Set the phone number
    pstmt->setString(3, address);           // Set the address
    pstmt->setString(4, llc);               // Set the LLC             
    pstmt->setInt(5, repair_partId);             // Set the id (to match the row to be updated)
    bool valid = pstmt->execute();
        return !valid;
}

bool repair_partsTable::delete_repair_part(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int repairPartId;
    if (json.contains("repair_part_id")) {
        repairPartId = json["repair_part_id"];
    } else {
        std::cout << "repair_partId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM repair_parts
        WHERE id = ?
    )"));

    pstmt->setInt(1, repairPartId); 

        bool valid = pstmt->execute();
        return !valid;
    }

