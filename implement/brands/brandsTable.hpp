#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class brandsTable{
public:
    brandsTable(sql::Connection* );
    int add_brand(nlohmann::json& json);
    nlohmann::json get_brands(nlohmann::json& json);
    
private:

    sql::Connection* connection;
public:
};