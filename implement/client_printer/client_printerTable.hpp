#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class client_printersTable{
public:
    client_printersTable(sql::Connection* );
    int add_client_printer(nlohmann::json& json);
    nlohmann::json get_client_printers(nlohmann::json& json);
    bool update_client_printer(nlohmann::json& json);
    bool delete_client_printer(nlohmann::json& json);

    
private:

    sql::Connection* connection;
public:
};