#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class cartridgesTable{
public:
    cartridgesTable(sql::Connection* );
    int add_cartridge(nlohmann::json& json);
    nlohmann::json get_cartridges(nlohmann::json& json);
    
private:

    sql::Connection* connection;
public:
};