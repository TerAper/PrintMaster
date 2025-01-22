#include "cartridgesTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

cartridgesTable::cartridgesTable(sql::Connection* conn):connection(conn){};

int cartridgesTable::add_cartridge(nlohmann::json& json){
    std::cout << "add cartridge =   "  <<json.dump(4);
    std::string name;
    int model_id;
    std::vector<unsigned char> photo_data;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
    if(json.contains("model_id")){
        model_id = json["model_id"];
    }else{
        std::cout << "model_id is empty" << std::endl;
        
    }
    
    int lastClientId = 0;
   
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
             INSERT INTO cartridges
            (name, model_id)
            VALUES (?, ?)
        )"));

        pstmt->setString(1, name);
        pstmt->setInt(2, model_id);
       
        bool valid = pstmt->execute();
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastClientId = res->getInt(1);
        std::cout << "lastInserted ID" << lastClientId << std::endl;
         std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            INSERT  INTO model_cartridge ( cartridge_id , model_id )
            VALUES (?,?)
        )"));
        pstmt->setInt(1, lastClientId);
        pstmt->setInt(2, model_id);

        if(!pstmt->execute()){
            std::cout << "cartridge_model is inserted " << std::endl;
        }
    }
    return lastClientId;
}

nlohmann::json cartridgesTable::get_cartridges(nlohmann::json& json) {
    nlohmann::json cartridges = nlohmann::json::array();
    int model_id = json["model_id"];

    try {
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        SELECT * FROM cartridges
        WHERE model_id = ?
    )"));
        pstmt->setInt(1, model_id);
        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
    
        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
            std::cout << "No results found." << std::endl;
            nlohmann::json successResponse;
            successResponse["status"] = "No_results_found";
            cartridges.push_back(successResponse);
        }

        // Process results
        while (res->next()) {
            nlohmann::json cartridge;
            cartridge["name"] = res->getString("name");
            cartridge["id"] = res->getInt("id");

            cartridges.push_back(cartridge);
            std::cout << "requestid resulte = "<<cartridge.dump(4)<<std::endl;
        }

    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;

    }catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
}

    return cartridges;
}
