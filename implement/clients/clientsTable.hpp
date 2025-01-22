#pragma once
#include <nlohmann/json.hpp>
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <ctime>
class clientsTable{
public:
    clientsTable(sql::Connection* );
    int add_client(nlohmann::json& json);
    nlohmann::json search_client(nlohmann::json& json);
    bool update_client(nlohmann::json& json);
    bool delete_client(nlohmann::json& json);

    
private:

    sql::Connection* connection;
public:
};