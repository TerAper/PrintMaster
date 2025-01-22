#include "brandsTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

brandsTable::brandsTable(sql::Connection* conn):connection(conn){};

int brandsTable::add_brand(nlohmann::json& json){
    std::cout << "add =   "  <<json.dump(4);
    std::string name;

    if(json.contains("name")){
        name = json["name"];
    }else{
        std::cout << "Name is empty" << std::endl;
        
    }
   
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    INSERT IGNORE INTO brands (name)
    VALUES (?)
)"));
    
    pstmt->setString(1, name);
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

nlohmann::json brandsTable::get_brands(nlohmann::json& json) {
    nlohmann::json brands = nlohmann::json::array();

    try {
    std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
    SELECT * FROM brands)"));

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
    
        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
            nlohmann::json successResponse;
            successResponse["status"] = "No_results_found";
            brands.push_back(successResponse);
        }

        // Process results
        while (res->next()) {
            nlohmann::json brand;
            brand["name"] = res->getString("name");
            brand["id"] = res->getInt("id");

            brands.push_back(brand);
            std::cout << "requestid resulte = "<<brand.dump(4)<<std::endl;
        }

    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;

    }catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
}

    return brands;
}
