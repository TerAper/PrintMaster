#include "dataBase.hpp"
#include <cppconn/connection.h>
#include <cppconn/resultset.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>
#include <memory>
#include <mysql_connection.h>
#include <mysql_driver.h>

template <typename Tp>
using Uptr = std::unique_ptr<Tp>;

DataBase::DataBase(sql::Connection* conn):
                                        printerTable(conn),
                                        clientsTable(conn),
                                        brandsTable(conn),
                                        modelsTable(conn),
                                        chipsTable(conn),
                                        client_printersTable(conn),
                                        client_printer_cartridgesTable(conn),
                                        cartridgesTable(conn),
                                        client_addressesTable(conn),
                                        client_phone_numbersTable(conn),
                                        ordersTable(conn),
                                        repair_partsTable(conn)
                                        {};

ConnectionPool::ConnectionPool(PoolParams params):connections(params.poolSize){
    sql::mysql::MySQL_Driver *driver(sql::mysql::get_driver_instance());
    std::string hostName = "tcp://" + params.dataBaseHost + ":" + params.dataBasePort;

    for(auto &connection:connections){
        connection.second = driver->connect(hostName, params.dataBaseLogin, params.dataBasePassword); 
        connection.second->setSchema(params.dataBaseName);
        connection.first = 0;
    }
}

sql::Connection* ConnectionPool::getConnection(long thredId){
    mutex.lock();
    while(true){
        for(auto &connection:connections){
            if(connection.first == 0){
                connection.first = thredId;
                mutex.unlock();
                return connection.second;
            }
        }
    }
    return nullptr;
}

void ConnectionPool::returnConnection(long thredId){
    for(auto &connection:connections){
        if(connection.first == thredId){
            connection.first = 0;
        }
    } 
}
                                   



    
    


