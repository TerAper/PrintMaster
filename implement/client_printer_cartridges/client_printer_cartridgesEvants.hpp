#include "../dataBase.hpp"
#include "../evantSwitch.hpp"
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

void add_client_printer_cartridges(const request &req, response &res, DataBase &db);
void get_client_printer_cartridges(const request &req, response &res, DataBase &db);
void update_client_printer_cartridge(const request &req, response &res, DataBase &db);
void delete_client_printer_cartridge(const request &req, response &res, DataBase &db);


void client_printer_cartridgesEvantsInitalaizer(EvantSwitch& evantSwitch);