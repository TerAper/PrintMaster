#include "modelsTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

modelsTable::modelsTable(sql::Connection* conn):connection(conn){};

int modelsTable::add_model(nlohmann::json& json){
    std::cout << "add =   "  <<json.dump(4);
    std::string name;
    std::string print_type;
    std::string color_type;
    int brand_id;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
    if(json.contains("print_type")){
        print_type = json["print_type"];
    }else{
        std::cout << "print_type is empty" << std::endl;
        
    }if(json.contains("color_type")){
        color_type = json["color_type"];
    }else{
        std::cout << "color_type is empty" << std::endl;
        
    }if(json.contains("brand_id")){
        brand_id = json["brand_id"];
    }else{
        std::cout << "brand_id is empty" << std::endl;
        
    }
   
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    INSERT IGNORE INTO models (name,print_type, color_type, brand_id)
    VALUES (?, ?, ?, ?)
)"));
    
    pstmt->setString(1, name);
    pstmt->setString(2, print_type);
    pstmt->setString(3, color_type);
    pstmt->setInt(4, brand_id);
    bool valid = pstmt->execute();
    int lastModelId = 0;
    if(!valid){
         std::unique_ptr<sql::Statement> stmt(connection->createStatement());
        std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
        res->next();
        lastModelId = res->getInt(1);
        std::cout << "lastInserted ID" << lastModelId << std::endl;
    }
    return lastModelId;
}

nlohmann::json modelsTable::get_models(nlohmann::json& json) {
    nlohmann::json models = nlohmann::json::array();
    int brand_id;
    std::string print_type;
    std::string color_type;
    try {
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
        SELECT id, name, print_type, color_type
        FROM models
        WHERE brand_id = ? AND print_type = ? AND color_type = ?
    )"));


         if(json.contains("print_type")){
            print_type = json["print_type"];
        }else{
            std::cout << "print_type is empty" << std::endl;
        
        }if(json.contains("color_type")){
            color_type = json["color_type"];
        }else{
            std::cout << "color_type is empty" << std::endl;

        }if(json.contains("brand_id")){
            brand_id = json["brand_id"];
        }else{
            std::cout << "brand_id is empty" << std::endl;
        }
        pstmt->setInt(1, brand_id);
        pstmt->setString(2, print_type);
        pstmt->setString(3, color_type);

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
    
        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
            nlohmann::json successResponse;
            successResponse["status"] = "No_results_found";
            models.push_back(successResponse);
            
        }

        // Process results
        while (res->next()) {
            nlohmann::json model;
            model["name"] = res->getString("name");
            model["print_type"] = res->getString("print_type");
            model["color_type"] = res->getString("color_type");
            model["id"] = res->getInt("id");

            models.push_back(model);
            std::cout << "requestid resulte model = "<<model.dump(4)<<std::endl;
        }

    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;

    }catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
}

    return models;
}
