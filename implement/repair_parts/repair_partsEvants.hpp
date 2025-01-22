#include "../dataBase.hpp"
#include "../evantSwitch.hpp"
using request = boost::beast::http::request<boost::beast::http::string_body>;
using response = boost::beast::http::response<boost::beast::http::string_body>; 
using FunctionPtr = void(*)(const request&, response&, DataBase&);

void add_repair_part(const request &req, response &res, DataBase &db);
void get_repair_parts(const request &req, response &res, DataBase &db);
void update_repair_part(const request &req, response &res, DataBase &db);
void delete_repair_part(const request &req, response &res, DataBase &db);


void repair_partsEvantsInitalaizer(EvantSwitch& evantSwitch);