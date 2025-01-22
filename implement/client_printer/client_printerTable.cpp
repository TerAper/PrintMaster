#include "client_printerTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

client_printersTable::client_printersTable(sql::Connection* conn):connection(conn){};

int client_printersTable::add_client_printer(nlohmann::json& json){
    std::cout << "add client_printer =   "  <<json.dump(4);
    int client_id;
    int printer_id;
    std::string description;
    if(json.contains("client_id")){
        client_id = json["client_id"];
    }else{
        std::cout << "client_id is empty" << std::endl;
        
    }
    if(json.contains("printer_id")){
        printer_id = json["printer_id"];
    }else{
        std::cout << "printer_id is empty" << std::endl;
        
    }
    if(json.contains("description")){
        description = json["description"];
    }else{
        std::cout << "description is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    INSERT INTO client_printer (client_id, printer_id, description )
    VALUES (?, ?, ? )
)"));
    
    pstmt->setInt(1, client_id);
    pstmt->setInt(2, printer_id);
    pstmt->setString(3, description);

    bool valid = pstmt->execute();
    int lastClientPrinterId = 0;
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastClientPrinterId = res->getInt(1);
        std::cout << "lastInserted ID" << lastClientPrinterId << std::endl;
    }
    return lastClientPrinterId;
}

nlohmann::json client_printersTable::get_client_printers(nlohmann::json& json) {
    nlohmann::json client_printers = nlohmann::json::array();
    std::cout << "get client printers =   "  <<json.dump(4);
    int client_id;

    // Extract parameters from the input JSON
    if (json.contains("client_id")) {
        client_id = json["client_id"];
    } else {
        std::cout << "client_id is empty" << std::endl;
    }
    
    try {
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            SELECT 
        cp.id AS client_printer_id,
        p.id AS printer_id,
        b.id AS brand_id,
        b.name AS brand_name,
        m.id AS model_id,
        m.name AS model_name,
        cp.description AS printer_description,
        m.print_type,
        m.color_type
    FROM 
        client_printer cp
    JOIN 
        printers p ON cp.printer_id = p.id
    JOIN 
        models m ON p.model_id = m.id
    JOIN 
        brands b ON m.brand_id = b.id
    WHERE
        cp.client_id = ?;
)"));
        pstmt->setInt(1,client_id);

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
    
        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
            nlohmann::json response = {{"status", "No results found"}, {"message", "No results found for client printer fatching"}};
            client_printers.push_back(response);
            return client_printers;
        }

        // Process results
        while (res->next()) {
            nlohmann::json client_printer;
            client_printer["brand_name"] = res->getString("brand_name");
            client_printer["model_name"] = res->getString("model_name");
            client_printer["print_type"] = res->getString("print_type");
            client_printer["color_type"] = res->getString("color_type");
            client_printer["client_printer_description"] = res->getString("printer_description");
            client_printer["client_printer_id"] = res->getInt("client_printer_id");
            client_printer["printer_id"] = res->getInt("printer_id");
            client_printer["model_id"] = res->getInt("model_id");
            client_printer["brand_id"] = res->getInt("brand_id");

            client_printers.push_back(client_printer);
            std::cout << "requestid resulte = "<<client_printer.dump(4)<<std::endl;
        }

        

    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;

    }catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
}

    return client_printers;
}

bool client_printersTable::update_client_printer(nlohmann::json& json){
    std::cout << "update =   "  <<json.dump(4);
    std::string name;
    std::string phone_number;
    std::string address;
    std::string llc;
    int client_printerId;

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
        client_printerId = json["id"];
    }else{
        std::cout << "client_printerId is empty" << std::endl;
        
    }
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    UPDATE client_printers
    SET name = ?, phone_number = ?, address = ?, llc = ?
    WHERE id = ?
)"));

    pstmt->setString(1, name);              // Set the name
    pstmt->setString(2, phone_number);      // Set the phone number
    pstmt->setString(3, address);           // Set the address
    pstmt->setString(4, llc);               // Set the LLC             
    pstmt->setInt(5, client_printerId);             // Set the id (to match the row to be updated)
    bool valid = pstmt->execute();
        return !valid;
}



bool client_printersTable::delete_client_printer(nlohmann::json& json) {
    std::cout << "delete =   "  << json.dump(4) << std::endl;
    int clientPrinterId;

    if (json.contains("client_printer_id")) {
        clientPrinterId = json["client_printer_id"];
    } else {
        std::cout << "client_printerId is empty" << std::endl;
    }

    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        DELETE FROM client_printer
        WHERE id = ?
    )"));

    pstmt->setInt(1, clientPrinterId); 

        bool valid = pstmt->execute();
        return !valid;
}

