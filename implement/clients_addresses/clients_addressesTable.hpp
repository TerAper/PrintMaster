#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class client_addressesTable{
public:
    client_addressesTable(sql::Connection* );
    int add_client_addresses(nlohmann::json& json);
    nlohmann::json get_client_addresses(nlohmann::json& json);
    bool update_client_address(nlohmann::json& json);
    bool delete_client_address(nlohmann::json& json);

    
private:

    sql::Connection* connection;
public:
};