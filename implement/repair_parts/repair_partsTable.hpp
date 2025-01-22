#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class repair_partsTable{
public:
    repair_partsTable(sql::Connection* );
    int add_repair_part(nlohmann::json& json);
    nlohmann::json get_repair_parts(nlohmann::json& json);
    bool update_repair_part(nlohmann::json& json);
    bool delete_repair_part(nlohmann::json& json);

    
private:

    sql::Connection* connection;
public:
};