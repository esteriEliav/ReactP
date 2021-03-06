//  הסבר כללי על כל קומפוננטה של תיקית אינדיבידואל

//   בכל קומפוננטה הסטייט מכיל: 
//   *מערך שמכיל אוביקטים של את שמות השדות המוצגות גם בעברית, סוג השדה ואטריביוטים נוספים במקרה הצורך
//   *מערך של שדות לחיפוש במקרה הצורך,כנ"ל הצגה
//   *מערך האוביקטים להצגה
// showForm-האם להציג חלונית מסוג פורם
//showDetails-האם להציחלונית מסוג דיטיילס
//showsomthing: איזה חלונית בדיוק לרנדר

//   כל קומפוננטה מכילה את הפונקציות הבאות:
//closeDetailsModal-סוגרת חלונית מסוג דיטיילס

//closeFormModal-סוגרת חלונית מסוג פורם


//   *validate-לאימות חוקיות אוביקט שנוסף/משתנה
// מחזירה:
// //isErr-אם יש שגיאת תקינות כלשהי
//  //generalEror-תוכן שגיאהת תקינות כללית לפורם
// //erors-מערך השגיאות עבור כל אחד מהשדות

//   *submitSearch-סבמיט לחיפוש

//   *submit-סבמיט לפורם (הוספה,עדכון ומחיקה)

//   *setForTable- פונקציה להוספת דברים הקשורים לקומפוננטת טייבל

//  *set -פונקציה שמוסיפה ומשנה דברים שקשורים לתצוגת אוביקט (גם באוביקט עצמו וגם באטנים ושדות שקשורים אליו)
//       הפונקציה ממפה את כל השדות של האוביקט והופכת איידי לשם ואת המפתחות זרים לקישורים
//       //מחזירה אוביקט:
//         //fieldsToAdd- שדות נוספים הקשורים לאוביקט
//         //LinksForEveryRow:לינקים שיש להוסיף בהצגת האוביקט (בקומפוננטת דיטיילס)
//         //ButtonsForEveryRow:באטנים שיש להוסיף לכל שורה בטבלה
//         //object- האוביקט לאחר השינויים שנעשו בו
//         //LinksPerObject: באטנים ולינקים הקשורים לאוביקט



//   *setForForm-פונקציה שמוסיפה ומשנה דברים שקשורים לעריכת והוספת אוביקט (באטנים ושדות שקשורים אליו)
//    //מחזירה אוביקט:
//    //fieldsToAdd- שדות נוספים הקשורים לאוביקט
//     //LinksPerObject: באטנים ולינקים הקשורים לאוביקט

//   *rend- פונקציה הבוחרת מה לרנדר  בהתאם לטייפ שנשלח אליה:
//         if (this.props.type === 'details')- מציג פרטים של אוביקט מסוים   
//         else if- (this.props.type === 'form') //מציג הוספה או עריכה של אוביקט 
//        else -אם לא נשלח טייפ תוצג הטבלה של כל האוביקטים




