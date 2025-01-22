#include "ordersTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

ordersTable::ordersTable(sql::Connection* conn):connection(conn){};

int ordersTable::add_order(nlohmann::json& json){
    std::cout << "add =   "  <<json.dump(4);
    int clientId;
    int addressId;
    int phoneNumberId;
    std::string orderDateTime;
    std::string description;

    
    if(json.contains("client_id")){
        clientId = json["client_id"];
    }else{
        std::cout << "brand_id is empty" << std::endl;
    }
    if(json.contains("order_datetime")){
        orderDateTime = json["order_datetime"];
    }else{
        std::cout << "orderDateTime is empty" << std::endl;
    }if(json.contains("description")){
        description = json["description"];
    }else{
        std::cout << "description is empty" << std::endl;
    }
    if(json.contains("address_id")){
        addressId = json["address_id"];
    }else{
        std::cout << "address_id is empty" << std::endl;
    }
    if(json.contains("phone_number_id")){
        phoneNumberId = json["phone_number_id"];
    }else{
        std::cout << "phone_number_id is empty" << std::endl;
    }
   
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    INSERT INTO orders (client_id,created_at, description, address_id, phone_number_id)
    VALUES (?, ?, ?, ?, ?)
)"));
    
    pstmt->setInt(1, clientId);
    pstmt->setString(2, orderDateTime);
    pstmt->setString(3, description);
    pstmt->setInt(4, addressId);
    pstmt->setInt(5, phoneNumberId);

    bool valid = pstmt->execute();
    int lastOrderId = 0;
    if(!valid){
        std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastOrderId = res->getInt(1);
        std::cout << "lastInserted ID" << lastOrderId << std::endl;
    }
    return lastOrderId;
}

nlohmann::json ordersTable::get_orders(nlohmann::json& json) {
    nlohmann::json orders = nlohmann::json::array();
    std::string startDate;
    std::string endDate;
    try {
        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
           SELECT 
    o.id AS order_id, 
    o.client_id, 
    o.description, 
    o.address_id, 
    o.phone_number_id, 
    o.created_at AS date, 
    o.state, 
    c.name AS client_name, 
    -- Subquery to fetch unique phone numbers for each client
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', p.id, 'number', p.phone_number)
        )
        FROM client_phone_numbers p
        WHERE p.client_id = c.id
    ) AS phone_numbers,
    -- Subquery to fetch unique addresses for each client
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT('id', a.id, 'address', a.address)
        )
        FROM client_addresses a
        WHERE a.client_id = c.id
    ) AS addresses
FROM 
    orders o
JOIN 
    clients c ON o.client_id = c.id
WHERE 
    DATE(o.created_at) BETWEEN ? AND ?
        )"));

        // Extract and validate input
        if (json.contains("start")) {
            startDate = json["start"];
        } else {
            std::cerr << "Error: startDate is empty or missing!" << std::endl;
            return {{"error", "startDate is required"}};
        }

        if (json.contains("end") ) {
            endDate = json["end"];
        } else {
            std::cerr << "Error: endDate is empty or missing!" << std::endl;
            return {{"error", "endDate is required"}};
        }

        // Bind parameters
        pstmt->setString(1, startDate);
        pstmt->setString(2, endDate);

        // Execute query
        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());

        if (!res->rowsCount()) {
            std::cout << "No results found." << std::endl;
            return {{"status", "No_results_found"}};
        }

        // Process results
        while (res->next()) {
            nlohmann::json order;
            order["order_id"] = res->getInt("order_id");
            order["client_id"] = res->getInt("client_id");
            order["description"] = res->getString("description");
            order["date"] = res->getString("date");
            order["state"] = res->getString("state");
            order["client_name"] = res->getString("client_name");
            order["address_id"] = res->getInt("address_id");
            order["phone_number_id"] = res->getInt("phone_number_id");

            // Get addresses and phone numbers
            std::string addresses = res->getString("addresses");
            std::string phone_numbers = res->getString("phone_numbers");

            // Assign empty array if addresses or phone numbers are empty
            if (addresses.empty()) {
                order["addresses"] = nlohmann::json::array();  // Empty array if no addresses
            } else {
                order["addresses"] = nlohmann::json::parse(addresses);  // Parse addresses if not empty
            }

            if (phone_numbers.empty()) {
                order["phone_numbers"] = nlohmann::json::array();  // Empty array if no phone numbers
            } else {
                order["phone_numbers"] = nlohmann::json::parse(phone_numbers);  // Parse phone numbers if not empty
            }

            orders.push_back(order);
            std::cout << "Processed order: " << order.dump(4) << std::endl;
        }

    } catch (sql::SQLException& e) {
        std::cerr << "SQL error: " << e.what() << std::endl;
    } catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    }

    return orders;
}

