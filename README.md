
## Описание проекта

* Asinus - с латинского "осел" - отсылка к Буриданову ослу
* Система для рационального выбора из нескольких вариантов
* Функционал: новый выбор, сохранение, загрузка (JSON или SQL), отменить/повторить, справка, автообновление, горячие клавиши, переводы.
  * Таблица1 - критерии: критерий, вес, инвертирован (?)
  * Таблица2 - варианты: вариант, критерий1, критерий2, ...
  * Таблица3 - оценки: вариант, оценка1, оценка2, ..., общая оценка. Вкл/выкл с весами или без. Возможна сортировка.
* Реализация - Electron, Qt, Cordova, Kivy, Cocos2d, ...