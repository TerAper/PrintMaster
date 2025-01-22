#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class chipsTable{
public:
    chipsTable(sql::Connection* );
    int add_chip(nlohmann::json& json);
    nlohmann::json get_chips(nlohmann::json& json);
    
private:

    sql::Connection* connection;
public:
};