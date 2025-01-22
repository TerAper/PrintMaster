#include "chipsTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

chipsTable::chipsTable(sql::Connection* conn):connection(conn){};

int chipsTable::add_chip(nlohmann::json& json){
    std::cout << "add chip =   "  <<json.dump(4);
    std::string name;
    int cartridge_id;
    std::vector<unsigned char> photo_data;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
    if(json.contains("cartridge_id")){
        cartridge_id = json["cartridge_id"];
    }else{
        std::cout << "cartridge_id is empty" << std::endl;
        
    }
    
    int lastCartridgeId = 0;
   
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
             INSERT INTO chips
            (name)
            VALUES (?)
        )"));

    pstmt->setString(1, name);
       
        bool valid = pstmt->execute();
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastCartridgeId = res->getInt(1);
        std::cout << "lastInserted ID" << lastCartridgeId << std::endl;
         std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            INSERT  INTO cartridge_chip ( chip_id , cartridge_id )
            VALUES (?,?)
        )"));
        pstmt->setInt(1, lastCartridgeId);
        pstmt->setInt(2, cartridge_id);

        if(!pstmt->execute()){
            std::cout << "cartridge_chip is inserted " << std::endl;
        }
    }
    return lastCartridgeId;
}

nlohmann::json chipsTable::get_chips(nlohmann::json& json) {
    nlohmann::json chips = nlohmann::json::array();
    int cartridge_id = json["cartridge_id"];

    try {
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        SELECT chips.id, chips.name, chips.photo
        FROM chips
        JOIN cartridge_chip ON chips.id = cartridge_chip.chip_id
        WHERE cartridge_chip.cartridge_id = ?;
    )"));
        pstmt->setInt(1, cartridge_id);
        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
    
        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
            std::cout << "No results found." << std::endl;
            nlohmann::json successResponse;
            successResponse["status"] = "No_results_found";
            chips.push_back(successResponse);
        }

        // Process results
        while (res->next()) {
            nlohmann::json chip;
            chip["name"] = res->getString("name");
            chip["id"] = res->getInt("id");

            chips.push_back(chip);
            std::cout << "requestid resulte = "<<chip.dump(4)<<std::endl;
        }

    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;

    }catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
}

    return chips;
}
