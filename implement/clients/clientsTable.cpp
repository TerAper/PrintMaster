#include "clientsTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

clientsTable::clientsTable(sql::Connection* conn):connection(conn){};

int clientsTable::add_client(nlohmann::json& json){
    std::cout << "add =   "  <<json.dump(4);
    std::string name;
    std::string llc;
    std::string clientType;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
    if(json.contains("llc")){
        llc = json["llc"];
    }else{
        std::cout << "LLC is empty" << std::endl;
        
    }
    if(json.contains("client_type")){
        clientType = json["client_type"];
    }else{
        std::cout << "client_type is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    INSERT INTO clients (name,llc,client_type)
    VALUES (?, ?, ?)
)"));
    
    pstmt->setString(1, name);
    pstmt->setString(2, llc);
    pstmt->setString(3, clientType);
    bool valid = pstmt->execute();
    int lastClientId = 0;
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastClientId = res->getInt(1);
        std::cout << "lastInserted ID" << lastClientId << std::endl;
    }
    return lastClientId;
}



nlohmann::json clientsTable::search_client(nlohmann::json& json) {
    nlohmann::json clients = nlohmann::json::array();
    std::cout << "Search input: " << json.dump(4);

    std::string name = json.contains("name") ? json["name"].get<std::string>() : "";
    std::string llc = json.contains("llc") ? json["llc"].get<std::string>() : "";
    std::string clientType = json.contains("client_type") ? json["client_type"].get<std::string>() : "";
    std::string phoneNumber = json.contains("phone_number") ? json["phone_number"].get<std::string>() : "";
    std::string address = json.contains("address") ? json["address"].get<std::string>() : "";


    try {
        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
   SELECT 
    c.id, 
    c.name, 
    c.llc, 
    c.client_type,
    -- Subquery to fetch unique phone numbers
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', p.id, 'number', p.phone_number)
        )
        FROM client_phone_numbers p
        WHERE p.client_id = c.id
    ) AS phone_numbers,
    -- Subquery to fetch unique addresses
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', a.id, 'address', a.address)
        )
        FROM client_addresses a
        WHERE a.client_id = c.id
    ) AS addresses
FROM clients c
LEFT JOIN client_phone_numbers p ON p.client_id = c.id
LEFT JOIN client_addresses a ON a.client_id = c.id
WHERE
    (LOWER(c.name) LIKE CONCAT('%', LOWER(?), '%') OR ? = '')
    AND (LOWER(c.llc) LIKE CONCAT('%', LOWER(?), '%') OR ? = '')
    AND (LOWER(c.client_type) LIKE CONCAT('%', LOWER(?), '%') OR ? = '')
    AND (
        p.phone_number IS NULL 
        OR (LOWER(p.phone_number) LIKE CONCAT('%', LOWER(?), '%') OR ? = '')
    )
    AND (
        a.address IS NULL 
        OR (LOWER(a.address) LIKE CONCAT('%', LOWER(?), '%') OR ? = '')
    )
GROUP BY c.id, c.name, c.llc, c.client_type;

        )"));

            // Ensure the value is passed as an empty string if it's not provided.
    pstmt->setString(1, name.empty() ? "" : name);
    pstmt->setString(2, name.empty() ? "" : name);
    pstmt->setString(3, llc.empty() ? "" : llc);
    pstmt->setString(4, llc.empty() ? "" : llc);
    pstmt->setString(5, clientType.empty() ? "" : clientType);
    pstmt->setString(6, clientType.empty() ? "" : clientType);
    pstmt->setString(7, phoneNumber.empty() ? "" : phoneNumber);
    pstmt->setString(8, phoneNumber.empty() ? "" : phoneNumber);
    pstmt->setString(9, address.empty() ? "" : address);
    pstmt->setString(10, address.empty() ? "" : address);

    std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());

    while (res->next()) {
        nlohmann::json client;
        client["id"] = res->getInt("id");

        client["name"] = res->getString("name");
        client["llc"] = res->getString("llc");
        client["client_type"] = res->getString("client_type");

        // Parse phone numbers
        std::string phones = res->getString("phone_numbers");
        client["phone_numbers"] = phones.empty() ? nlohmann::json::array() : nlohmann::json::parse(phones);
        //std::cout << "Xx " << client["phone_numbers"]<<std::endl;
        // Parse addresses
        std::string addresses = res->getString("addresses");
        client["addresses"] = addresses.empty() ? nlohmann::json::array() : nlohmann::json::parse(addresses);

        clients.push_back(client);
    }
    } catch (sql::SQLException& e) {
        std::cerr << "SQL error: " << e.what() << std::endl;
    } catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    }

    return clients;
}




bool clientsTable::update_client(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string name;
    std::string llc;
    std::string clientType;
    int clientId;

    if(json.contains("updated_name")){
        name = json["updated_name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }  
    if(json.contains("updated_llc")){
        llc = json["updated_llc"];
    }else{
        std::cout << "LLC is empty" << std::endl;
        
    }
    if(json.contains("updated_type")){
        clientType = json["updated_type"];
    }else{
        std::cout << "client_type is empty" << std::endl;
        
    }
    if(json.contains("client_id")){
        clientId = json["client_id"];
    }else{
        std::cout << "clientId is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE clients
    SET name = ?, llc = ?, client_type = ?
    WHERE id = ?
)"));

    pstmt->setString(1, name);              // Set the name
    pstmt->setString(2, llc);               // Set the LLC             
    pstmt->setString(3, clientType);               // Set the LLC             
    pstmt->setInt(4, clientId);             // Set the id (to match the row to be updated)
    bool valid = pstmt->execute();
        return !valid;
}

bool clientsTable::delete_client(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int clientId;

    if (json.contains("client_id")) {
        clientId = json["client_id"];
    } else {
        std::cout << "clientId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM clients
        WHERE id = ?
    )"));

    pstmt->setInt(1, clientId); 

        bool valid = pstmt->execute();
        return !valid;
}

