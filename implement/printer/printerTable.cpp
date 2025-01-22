#include "printerTable.hpp"
#include <cppconn/connection.h>
#include <cppconn/prepared_statement.h>

printerTable::printerTable(sql::Connection* conn):connection(conn){};


   int printerTable::addPrinter(nlohmann::json json) {
    int brand_id;
    int model_id;
    std::string model_name;
    //std::vector<unsigned char> photo_data;

    // Extracting values from JSON, with fallback handling
    if (json.contains("brand_id")) {
        brand_id = json["brand_id"];
    } else {
        std::cout << "brand_id is empty" << std::endl;
    }

    if (json.contains("model_id")) {
        model_id = json["model_id"];
    } else {
        std::cout << "model_id is empty" << std::endl;
    }
        int lastPrinterId = 0;
    try {
        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
             INSERT INTO printers
            (brand_id, model_id)
            VALUES (?, ?)
        )"));

        pstmt->setInt(1, brand_id);
        pstmt->setInt(2, model_id);
       
        bool valid = pstmt->execute();
        
        if (!valid) {
            std::unique_ptr<sql::Statement> stmt(connection->createStatement());
            std::unique_ptr<sql::ResultSet> res(stmt->executeQuery("SELECT LAST_INSERT_ID()"));
            if (res->next()) {
                lastPrinterId = res->getInt(1);
                std::cout << "Last inserted printer ID = " << lastPrinterId << std::endl;
            }
        } else {
            std::cerr << "Failed to insert printer data" << std::endl;
        }

        } catch (sql::SQLException& e) {
            std::cerr << "SQL error: " << e.what() << std::endl;
        } catch (std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
        }
    return lastPrinterId;  
}


    nlohmann::json printerTable::getPrinters(nlohmann::json json) {
        nlohmann::json printers = nlohmann::json::array();

    try {
        std::unique_ptr<sql::PreparedStatement> pstmt(connection->prepareStatement(R"(
            SELECT * FROM  printers
        )"));

        std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());

        if (res->rowsCount() > 0) {
            std::cout << "Results found: " << res->rowsCount() << std::endl;
        } else {
            std::cout << "No results found." << std::endl;
        }

        // Process results
        while (res->next()) {
            nlohmann::json printer;
            printer["brand_name"] = res->getInt("brand_name");
            printer["model_name"] = res->getInt("model_name");
            printer["description"] = res->getString("description");
            printer["id"] = res->getInt("id");

            printers.push_back(printer);
            std::cout << "requestid result = " << printers.dump(4) << std::endl;
        }
    } catch (sql::SQLException& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    } catch (std::exception& e) {
        std::cerr << "General error: " << e.what() << std::endl;
    }

    return printers;
}
