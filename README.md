pedurma-catalog
===============
從bampocompare.xlsx 貼到  bampo.tsv
注意不能有缺漏，不能有空行。第一行是欄位名

	lj0001_024	1@302b2	95@339b5	缺lhasa	缺dege

執行：

    node gen_bampo.js

格式有錯程式會報，如9@246s3

通過後，將產生出來的資料，例
{
 "J5_9": "9@113b2-124a8",
 "D5_9": "9@119a4-130b8",
 "H5_9": "9@164b4-180b2",
 "C1035_9": "103@124a5-135b8"
},

人工合併到jinglu.json