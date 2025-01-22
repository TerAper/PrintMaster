#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class modelsTable{
public:
    modelsTable(sql::Connection* );
    int add_model(nlohmann::json& json);
    nlohmann::json get_models(nlohmann::json& json);
    
private:

    sql::Connection* connection;
public:
};