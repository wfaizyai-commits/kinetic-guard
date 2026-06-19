/* ─── i18n strings ─── */
const T = {
  ar: {
    banner:"معاينة تصميم · نقدر نعدّل أي شي قبل النشر",
    navCta:"انضم للقائمة", skip:"تخطّ إلى المحتوى", emailAria:"بريدك الإلكتروني للانضمام لقائمة الانتظار", pill:"قريباً في السعودية · Q4 2026",
    topbar:"سجّل مبكراً واحصل على ٣ أشهر FitGuard Pro مجاناً ←", topbarAria:"سجّل في قائمة الانتظار", topbarClose:"إغلاق الشريط",
    navWomen:"للنساء", wmCta:"اكتشفي تجربة FitGuard للنساء ←",
    h1:'قبل التمرين<br><span class="hl">نتأكد إن جسمك جاهز</span>',
    heroSub:"أول مدرب لياقة ذكي بالعربي يفحص جاهزيتك قبل كل تمرين، يتابع حركتك، ويصمّم برنامجك على حسب جسمك ويومك — وبأمان.",
    emailPh:"بريدك الإلكتروني", ctaBtn:"احجز مكانك ",
    note:'انضم مبكراً واحصل على <b>FitGuard Pro</b> مجاناً ٣ أشهر.',
    spText:"كن من أوّل المنضمّين لقائمة الانتظار",
    phGreet:"مساء الخير، وليد ✦ جاهزيتك اليوم", phReady:"جاهزية", phReadyT:"جاهز للتمرين", phReadyP:"جسمك مستعد اليوم. ابدأ بإحماء ٨ دقايق.",
    pray:[["الظهر","11:52",0],["العصر","3:22",1],["المغرب","6:42",0],["العشاء","8:12",0]],
    phDay:"يوم ٢: صدر وذراع", phEx1:"ضغط الصدر", phEx1m:"صدر", phEx2:"دفع الترايسبس", phEx2m:"خلف الذراع",
    phScanT:"مسح بالذكاء", phScanL:"صوّر الجهاز أو الشاشة", phScanR:"ضغط الأرجل", phScanM:"تم التعرّف والتسجيل",
    scarLeft:"الأماكن المجانية تنفد بسرعة", scarSpots:"مكان متبقّي",
    hs1:"ميزات حصرية", hs2v:"٥ أيام", hs2:"برنامج تقسيم", hs3:"عربي أصيل",
    stbTag:"لماذا الآن", stbTitle:"السلامة مو رفاهية — ضرورة", stbSub:"الإصابات الرياضية في ارتفاع، ورؤية ٢٠٣٠ تدفع ملايين السعوديين للرياضة. FitGuard في قلب هذه اللحظة.",
    stb1n:"إصابات\nيمكن تفاديها", stb1:"كثير من إصابات الجيم سببها أداء خاطئ أو حِمل زائد — والوقاية ممكنة",
    stb2n:"تعافٍ\nآمن", stb2:"الكثير في MENA يتعافون من إصابات رياضية ويحتاجون تمريناً آمناً",
    stb3:"هدف رؤية ٢٠٣٠: رفع ممارسة الرياضة من ١٣٪ إلى ٤٠٪ من السكان",
    stb4n:"سوق\nمتنامٍ", stb4:"قطاع اللياقة في السعودية من الأسرع نمواً ضمن رؤية ٢٠٣٠",
    stbSrc:"* هدف رؤية ٢٠٣٠ مصدره الهيئة العامة للرياضة. باقي النقاط توجّهات عامة للقطاع تُدعم بمصادر موثّقة قبل أي عرض رسمي.",
    aiResN:"ضغط الأرجل", aiResM:"تم التعرّف والتسجيل ✓", aiResC:"ثقة عالية",
    aiBadge:"مدعوم بالذكاء الاصطناعي", aiTitle:"سجّل تمارينك بصورة وحدة",
    aiSub:"ما تحتاج تختار من قوائم طويلة — صوّر، والذكاء الاصطناعي يسوّي الباقي.",
    aiF1t:"مسح الأجهزة بالكاميرا", aiF1p:"صوّر أي جهاز في الجيم، والذكاء يتعرّف على التمرين والعضلة ويضيفه فوراً.",
    aiF2t:"قراءة شاشات الكارديو", aiF2p:"صوّر شاشة المشاية أو الدراجة، ويقرأ الوقت والمسافة والسعرات تلقائياً.",
    aiF3t:"تعديل آمن للإصابات", aiF3p:"الذكاء يعرف إصاباتك ويبدّل التمارين الخطرة بآمنة — بدون ما تفكّر.",
    rewTag:"الحافز", rewTitle:"كل تمرين يقرّبك خطوة", rewSub:"نظام مكافآت يخليك ترجع كل يوم — مبني على علم العادات.",
    rew1t:"سلسلة يومية", rew1p:"حافظ على تمرينك (ومشيك يُحتسب!) وشوف السلسلة تكبر يوم بعد يوم ",
    rew2t:"نقاط الخبرة والمستويات", rew2p:"كل تمرين يعطيك XP، ترتقي بالمستويات وتفتح ألقاب جديدة.",
    rew3t:"أوسمة وإنجازات", rew3p:"اجمع ميداليات على إنجازاتك — أول تمرين، ٧ أيام متتالية، وأكثر.",
    xpLvl:"المستوى ٧ · محارب", xpStreak:"١٢ يوم متتالي",
    capTag:"الذكاء في القلب", capTitle:"الذكاء الاصطناعي يفهمك — مو بس يسجّل",
    capSub:"من أول سؤال لين آخر تكرار، الذكاء الاصطناعي يتكيّف معك أنت.",
    capSoon:"قريباً",
    cap1t:"محرك التكيّف", cap1p:"يعدّل برنامجك تلقائياً حسب جاهزيتك، إصاباتك، وتقدّمك — كل يوم.",
    cap2t:"كوتش ذكي يردّ عليك", cap2p:"اسأل عن أي تمرين أو ألم، ويعطيك جواب مبني على حالتك بالعربي.",
    cap3t:"تحليل ذكي للتقدّم", cap3p:"يكتشف الأنماط: عضلة مهملة، حِمل زائد، أو وقت تحتاج فيه راحة.",
    cap4t:"خصوصية أولاً", cap4p:"تحليل الصور آمن وما نحتفظ بها، ومتوافق مع نظام حماية البيانات PDPL.",
    acTag:"مدرّبك الذكي", acTitle:'مساعد ذكي يعرفك <span class="hl">إنت</span> — مش نصائح عامة',
    acSub:"اسأله أي حاجة عن تمرينك أو نظامك الغذائي. يحلّل حالتك إنت بالذات، ويردّ بالعربي — وبأمان.",
    acBotName:"مدرّب FitGuard", acBotStatus:"متصل",
    acQ1:"نمت ٤ ساعات بس امبارح… أتمرّن ولا أرتاح؟",
    acA1:'نومك ٤ ساعات نزّل جاهزيتك إلى <b>٥١٪</b>. التمرين الثقيل النهاردة يرفع خطر الإصابة ويضعف تركيزك. أنصحك بجلسة خفيفة: <b>كارديو + إطالة ٢٠ دقيقة</b>، وترجع بقوة بكرة. أعدّل برنامج النهاردة؟',
    acChip1:"✅ عدّل برنامجي", acChip2:"😴 نصائح لنوم أفضل",
    acPh:"اسأل أي حاجة عن تمرينك أو أكلك…",
    acBadge:"ذكاء مُدرَّب على سلامتك إنت",
    ac1t:"الأمان أولاً", ac1p:"يتأكد إن التمرين مناسب لجاهزيتك وإصاباتك قبل أي نصيحة.",
    ac2t:"يعرف سياقك الكامل", ac2p:"جاهزيتك، تاريخك، دورتك، ورمضان — كله في الحسبان.",
    ac3t:"يشرح كل قرار", ac3p:"مايقولّكش «اعمل كذا» وبس — يقولّك ليه، عشان تتعلّم.",
    ac4t:"تمرين وتغذية معاً", ac4p:"إرشاد أكل حلال يتماشى مع تمرينك وأهدافك اليومية.",
    faqTag:"أسئلة شائعة", faqTitle:"كل اللي محتاج تعرفه",
    faqQ1:"كم يكلّف FitGuard؟", faqA1:"فيه خطة مجانية بالمزايا الأساسية، وخطة Pro مدفوعة بسعر يناسب السوق السعودي. ومن ينضم مبكراً يحصل على ٣ أشهر Pro مجاناً.",
    faqQ2:"هل بياناتي وخصوصيتي آمنة؟", faqA2:"نعم، بياناتك محفوظة بأمان ومتوافقة مع نظام حماية البيانات السعودي (PDPL)، ولا تُشارك مع أي طرف — ولا نطلب أي صور إجبارية.",
    faqQ3:"ما هو FitGuard؟", faqA3:"FitGuard هو أول مدرب لياقة ذكي بالعربي يركّز على السلامة ومنع الإصابة قبل أي شيء — يفحص جاهزيتك قبل كل تمرين ويصمّم برنامجك على حسب جسمك ويومك.",
    faqQ4:"كيف يحميني من الإصابة؟", faqA4:"يقيس جاهزيتك اليومية ويراعي إصاباتك السابقة، فيعدّل شدّة التمرين والحركات تلقائياً، وينبّهك قبل ما تحمّل نفسك أكثر من اللازم.",
    faqQ5:"هل فيه مساعد ذكي يجاوب على أسئلتي؟", faqA5:"نعم — مساعد ذكي متخصص يجاوب على كل أسئلتك عن تمرينك وتغذيتك، يحلّل حالتك أنت بالذات، ويشرح سبب كل توصية.",
    faqQ6:"هل يناسب النساء؟", faqA6:"نعم، فيه برنامج نسائي يراعي مراحل الدورة الشهرية، بتمارين مناسبة ثقافياً وخصوصية كاملة بدون صور إجبارية.",
    faqQ7:"متى يُطلق التطبيق؟", faqA7:"الإطلاق مستهدف في السعودية في الربع الأخير من ٢٠٢٦، مع وصول مبكر عبر TestFlight لمن ينضم لقائمة الانتظار.",
    faqQ8:"كيف أنضم لقائمة الانتظار؟", faqA8:"أضف بريدك الإلكتروني في الأعلى، وتوصلك دعوة الوصول المبكر وإشعار الإطلاق فور توفّره.",
    navFeat:"المميزات", navAcad:"الأكاديمية",
    featPTag:"المميزات", featPTitle:"كل ما يحميك — في تطبيق واحد", featPSub:"جاهزية يومية، مسح بالذكاء، مدرّب يتكلم عربي، برنامج نسائي، وأوقات صلاتك — كلها مبنية حول سلامتك.",
    acadTag:"الأكاديمية", acadTitle:"تعلّم تتمرّن بأمان", acadSub:"مقالات قصيرة بالعربي في اللياقة والصحة والوقاية من الإصابات — من فريق FitGuard.",
    afAll:"الكل", afFit:"لياقة", afHealth:"صحة", afInjury:"وقاية وتعافي",
    ar1t:"٥ أخطاء إحماء توصلك للإصابة", ar1p:"أكثر أخطاء ما قبل التمرين شيوعاً — وكيف تتفاداها في ٨ دقايق.", ar1m:"يونيو ٢٠٢٦ · ٥ دقايق قراءة",
    ar2t:"كيف تختار وزنك الأول في الجيم؟", ar2p:"قاعدة بسيطة تحدد بها وزن البداية الآمن لأي تمرين — بدون تخمين.", ar2m:"يونيو ٢٠٢٦ · ٤ دقايق قراءة",
    ar3t:"النوم وعلاقته بنتائجك", ar3p:"ليش ٦ ساعات نوم تنسف مجهود أسبوع كامل — وكيف تعوّض بذكاء.", ar3m:"مايو ٢٠٢٦ · ٥ دقايق قراءة",
    ar4t:"رجعت من إصابة؟ خطة العودة الآمنة", ar4p:"متى ترجع للحديد بعد الإصابة، وبأي شدّة، وما هي علامات الخطر.", ar4m:"مايو ٢٠٢٦ · ٦ دقايق قراءة",
    ar5t:"تقسيمة ٣ أيام للمبتدئين", ar5p:"برنامج أسبوعي كامل يبني قوتك بالتدريج — بدون إرهاق مفاصلك.", ar5m:"مايو ٢٠٢٦ · ٥ دقايق قراءة",
    ar6t:"الترطيب: كم تحتاج ماء فعلاً؟", ar6p:"حاسبة بسيطة لاحتياجك اليومي، وعلامات الجفاف وقت التمرين.", ar6m:"أبريل ٢٠٢٦ · ٤ دقايق قراءة",
    acadNote:"مقالات جديدة كل أسبوع — انضم للقائمة وتوصلك أولاً بأول.",
    stickyCta:"احجز مكانك — ٣ أشهر Pro مجاناً",
    rmTag:"خارطة الطريق", rmTitle:"نكبر معك — مرحلة بمرحلة", rmSub:"ما نرمي كل شي دفعة وحدة. كل مرحلة تركّز على شي واحد تتقنه — وتحديثات جديدة تصلك باستمرار.",
    rm1n:"١", rm1w:"Q4 2026", rm1k:"الإطلاق", rm1f:'<span class=\"rm-chip\">فحص السلامة</span><span class=\"rm-chip\">جاهزية اليوم</span><span class=\"rm-chip\">برنامج متكيّف</span><span class=\"rm-chip\">إحماء موجّه</span><span class=\"rm-chip\">أوقات الصلاة</span><span class=\"rm-chip\">أساسيات نسائية</span>', rm1g:"جوهر الحماية أولاً — كل ميزة هنا تتأكد إن جسمك جاهز قبل ما تلمس الحديد.",
    rm2n:"٢", rm2w:"بعد الإطلاق", rm2k:"التفاعل", rm2f:'<span class=\"rm-chip\">المدرّب الذكي بالعربي</span><span class=\"rm-chip\">مسح بالذكاء</span><span class=\"rm-chip\">أوسمة وسلاسل</span><span class=\"rm-chip\">خريطة العضلات</span><span class=\"rm-chip\">وضع رمضان</span>', rm2g:"التمرين يتحوّل لعادة يومية ممتعة — ذكاء يرافقك، وأوسمة تحفّزك، ورمضان محسوب.",
    rm3n:"٣", rm3w:"٢٠٢٧", rm3k:"التوسّع", rm3f:'<span class=\"rm-chip\">FitGuard للنساء الكامل</span><span class=\"rm-chip\">ذكاء الدورة الشهرية</span><span class=\"rm-chip\">الأكاديمية داخل التطبيق</span><span class=\"rm-chip\">تغذية حلال</span><span class=\"rm-chip\">بدائل منزلية</span>', rm3g:"تجربة أعمق لكل شريحة — وللنساء هوية كاملة خاصة بهنّ.",
    rm4n:"٤", rm4w:"المستقبل", rm4k:"النمو", rm4f:'<span class=\"rm-chip\">برنامج الإحالة</span><span class=\"rm-chip\">تقارير تقدّم متقدمة</span><span class=\"rm-chip\">شراكات أندية وعلاج طبيعي</span><span class=\"rm-chip\">التوسع الخليجي</span><span class=\"rm-chip\">Android</span>', rm4g:"من تطبيق إلى منظومة لياقة آمنة بالعربي — في كل الخليج.",
    showTitle:"مبني للحديد الحقيقي", showSub:"تمارين الجيم بالأوزان والسيتات والتقدّم — مو مجرد تطبيق منزلي.",
    vizTag:"تتبّع ذكي", vizTitle:"شوف تقدّمك يكبر", vizSub:"رسوم بيانية حيّة لكل تمرين، حجم التدريب، والعضلات اللي اشتغلت.",
    chartT:"نقاط السلامة عبر الوقت", chartS:"آخر ٨ أسابيع",
    volT:"حجم التدريب الأسبوعي", volS:"كجم مرفوعة · يتزايد كل أسبوع",
    figT:"خريطة تفعيل العضلات", figS:"كل تمرين يضيء العضلة الصحيحة — بدقة علمية",
    gapTag:"الفرصة", gapTitle:"كل تطبيقات اللياقة مبنية لشخص غيرك",
    gapSub:"تنزّل تطبيق أجنبي، إنجليزي، ما يعرف جدولك ولا صلاتك ولا إصاباتك. FitGuard أول واحد مبني لك أنت.",
    gap1t:"✗ التطبيقات الحالية", gap1p:"إنجليزية، برنامج واحد للجميع، بدون فحص إصابات، وما تفهم ثقافتك.",
    gap2t:"✗ المدرب الشخصي", gap2p:"غالي، مو متاح ٢٤ ساعة، ويختلف من شخص لشخص.",
    gap3t:"✦ FitGuard", gap3p:"عربي ١٠٠٪، يفحص جاهزيتك وإصاباتك، يحترم وقتك وصلاتك، ويتكيّف معك.",
    gapHl:'ما في تطبيق لياقة عربي يجمع <span class="hl">الأمان + الذكاء + الثقافة</span> في مكان واحد. إلى الآن.',
    storyTag:"القصة", storyTitle:"ليه بنينا FitGuard",
    sc1n:"١", sc2n:"٢", sc3n:"٣", sc4n:"٤",
    sc1k:"البداية", sc1t:"دخلت الجيم متحمّس… وطلعت بإصابة.", sc1p:"قصة تتكرر كل يوم: حماس زائد، وزن أكبر من جاهزيتك، وأداء غلط — والنتيجة ألم يوقفك أسابيع.",
    sc2k:"المشكلة", sc2t:"كل التطبيقات تعطيك تمارين… محدش يسألك إذا جسمك جاهز.", sc2p:"برنامج واحد للجميع، بلا فحص إصابات، بلا إحساس بيومك. تتمرّن وانت مش عارف إذا اليوم مناسب أصلاً.",
    sc3k:"التحوّل", sc3t:'قلبنا المعادلة: <span class="hl">الأمان أولاً، قبل الحديد.</span>', sc3p:"FitGuard يفحص جاهزيتك كل يوم، يحلل حالتك، ويصمّم تمرينك على حسب جسمك — مو العكس. أول مدرب يقرّر معك متى وكيف تتمرّن بأمان.",
    sc4k:"الوعد", sc4t:"تتمرّن بذكاء، توصل أبعد، وانت محميّ.", sc4p:"مش مجرد تطبيق تمارين — شريك يحميك من الإصابة ويبني قوتك على المدى الطويل. عشان تستمر، مو تتوقف.",
    howTag:"كيف يشتغل", howTitle:"٣ خطوات تحميك من الإصابة", howSub:"FitGuard ما يعطيك تمارين عشوائية — يقرر معك متى تتمرن، كيف، وبأي شدة.",
    s1n:"الخطوة ٠١", s1t:"فحص السلامة", s1p:"٦ أسئلة ذكية تحدّد مستواك وإصاباتك، وتبني لك برنامجاً آمناً.",
    s2n:"الخطوة ٠٢", s2t:"جاهزية اليوم", s2p:"كل صباح نقيس نومك وتوتّرك وإجهادك، ونقول لك: تتمرّن أو ترتاح.",
    s3n:"الخطوة ٠٣", s3t:"برنامج يتكيّف", s3p:"تقسيم جيم حقيقي يتعدّل تلقائياً حسب جاهزيتك وإصاباتك.",
    featTag:"مبني لك", featTitle:"أشياء ما بتلقاها في أي تطبيق ثاني", featSub:"هذي مو إضافات — هذي السبب اللي يخلّي FitGuard لك أنت.",
    excl:"حصري",
    f1t:"مدمج مع أوقات الصلاة", f1p:"يرتب تمرينك حول الصلاة تلقائياً، وينبّهك بالنافذة المناسبة.",
    f2t:"وضع رمضان", f2p:"تمارين مكيّفة للصيام — توقيت بعد الإفطار، شدة أقل، ترطيب وتغذية.",
    f3t:"برنامج نسائي + متتبّع الدورة", f3p:"تمارين مناسبة ثقافياً وتتكيّف مع المرحلة الشهرية.",
    f4t:"تعديل الإصابات تلقائياً", f4p:"ألم بالركبة أو عملية سابقة؟ نبدّل التمارين الخطرة بآمنة فوراً.",
    f5t:"خريطة العضلات", f5p:"تشوف بالضبط أي عضلة تشتغل في كل تمرين — بدقة علمية.",
    f6t:"تتبّع تقدمك", f6p:"سلسلة يومية، أوسمة، ومشيك يُحتسب — كل حركة تعدّ.",
    prTag:"حصري · أول تطبيق يسويها", prTitle:'تمرينك يحترم <span class="hl">وقت صلاتك</span>',
    prSub:"FitGuard يعرف مواعيد الصلاة في مدينتك، ويرتّب تمرينك حولها تلقائياً — تتمرّن وتصلّي بدون ما تفوّت ولا واحدة.",
    prP1:"مواعيد دقيقة حسب موقعك (أم القرى وغيرها).",
    prP2:"ينبّهك بأفضل نافذة تمرين بين الصلوات.",
    prP3:"يوقف المؤقّت تلقائياً وقت الأذان لو طلبت.",
    prNextLbl:"الصلاة القادمة", prNextName:"العصر", prNextCd:"بعد ٤٥ دقيقة",
    prF:"الفجر", prD:"الظهر", prA:"العصر", prM:"المغرب", prI:"العشاء",
    prWindow:"💡 عندك <b>٤٥ دقيقة</b> قبل العصر — وقت ممتاز لجلسة سريعة.",
    wmHer:"للنساء", wmTag:"حصري · مصمّم لكِ", wmTitle:'برنامج نسائي <span class="hl">يفهم جسمك</span>',
    wmSub:"تمارين مناسبة ثقافياً تتكيّف مع مراحل دورتك الشهرية — شدّة أعلى وقت طاقتك، وألطف وقت ما تحتاجين.",
    wmP1:"متتبّع دورة مدمج يضبط شدّة التمرين.",
    wmP2:"تمارين منزلية ومناسبة، بخصوصية كاملة.",
    wmP3:"ثيم وتجربة مصمّمة خصيصاً للنساء.",
    cyPhase:"الإباضة", cyDay:"اليوم ١٤",
    cyP1:"الحيض", cyP2:"الإباضة", cyP3:"الجريبية", cyP4:"الأصفرية",
    visTag:"رؤية ٢٠٣٠", visTitle:"نتماشى مع أجندة المملكة الرياضية",
    visP:"هدف رفع ممارسة الرياضة من ١٣٪ إلى ٤٠٪ بحلول ٢٠٣٠ — FitGuard أداة تساعد على ذلك بأمان.",
    visStat:"نمو سنوي لقطاع اللياقة في السعودية",
    joinTag:"انضم الآن", joinTitle:"كن أول من يجرّب FitGuard",
    joinP:"سجّل بريدك، وبنرسل لك دعوة TestFlight قبل الإطلاق الرسمي + ٣ أشهر Pro مجاناً.",
    joinNote:"🔒 ما نرسل سبام. بريدك يُحفظ بأمان (متوافق مع PDPL).",
    footTag:"تدرّب بذكاء. ابقَ محمياً. · Train Smart. Stay Safe.",
    fPrivacy:"الخصوصية", fTerms:"الشروط", fContact:"تواصل معنا",
    medical:"تنبيه طبي: محتوى FitGuard لأغراض اللياقة والمعلومات فقط وليس استشارة طبية. استشر مختصاً قبل بدء أي برنامج رياضي، خاصة مع وجود إصابة أو حالة صحية. ميزات الجاهزية والإصابات إرشادية ولا تُغني عن رأي الطبيب.",
    trustTag:"لماذا تثق بنا", trustTitle:"مبني على الأمان والخصوصية",
    t1t:"بمبادئ علاج طبيعي", t1p:"كل توصية مبنية على علم الوقاية من الإصابات وأفضل ممارسات التدريب الآمن — مو مجرد خوارزمية.",
    t2t:"خصوصية كاملة (PDPL)", t2p:"بياناتك محفوظة بأمان ومتوافقة مع نظام حماية البيانات السعودي، ولا تُشارك مع أي طرف.",
    t3t:"صُنع في السعودية", t3p:"مبني محلياً يفهم لغتك وثقافتك وأوقات صلاتك ورمضان — لا ترجمة مستوردة.",
    msgOk:"✓ تم تسجيلك! بنرسل لك الدعوة قريباً.", msgDup:"✓ أنت مسجّل بالفعل!", msgErr:"صار خطأ، حاول مرة ثانية.", msgInvalid:"تأكد من صيغة البريد الإلكتروني.", msgSending:"جارٍ الإرسال…", msgDone:"✓ تم",
    tyTitle:"تم! أنت على القائمة 🎉", tySub:"بنرسل لك دعوة TestFlight قبل الإطلاق + ٣ أشهر Pro مجاناً. خلّ عينك على بريدك.",
    tyDupTitle:"أنت مسجّل بالفعل ✓", tyDupSub:"بريدك موجود عندنا — بنرسل لك الدعوة فور توفّرها.",
    refTitle:"شارك رابطك مع أصحابك", refSub:"برنامج مكافآت الإحالة ينطلق مع الإطلاق 🎁",
    refCopy:"نسخ", refCopied:"تم النسخ ✓", refAria:"رابط الإحالة الخاص بك"
  },
  en: {
    banner:"Design preview · we can change anything before launch",
    navCta:"Join the list", skip:"Skip to content", emailAria:"Your email to join the waitlist", pill:"Coming to Saudi Arabia · Q4 2026",
    topbar:"Sign up early and get 3 months of FitGuard Pro free →", topbarAria:"Sign up to the waitlist", topbarClose:"Dismiss bar",
    navWomen:"For Her", wmCta:"Explore the women's experience →",
    h1:'Before you train<br><span class="hl">we make sure your body\'s ready</span>',
    heroSub:"The first Arabic AI fitness safety coach. It checks your readiness before every workout, watches your form, and adapts your program to your body and your day — safely.",
    emailPh:"Your email", ctaBtn:"Reserve my spot ",
    note:'Join early and get <b>FitGuard Pro</b> free for 3 months.',
    spText:"Be among the first to join the waitlist",
    phGreet:"Good evening, Waleed ✦ today's readiness", phReady:"ready", phReadyT:"Ready to train", phReadyP:"Your body's primed today. Start with an 8-min warm-up.",
    pray:[["Dhuhr","11:52",0],["Asr","3:22",1],["Maghrib","6:42",0],["Isha","8:12",0]],
    phDay:"Day 2: Chest & Triceps", phEx1:"Bench Press", phEx1m:"Chest", phEx2:"Tricep Pushdown", phEx2m:"Triceps",
    phScanT:"AI Scan", phScanL:"Snap the machine or screen", phScanR:"Leg Press", phScanM:"detected & logged",
    scarLeft:"Free spots are filling fast", scarSpots:"spots left",
    hs1:"exclusive features", hs2v:"5-day", hs2:"training split", hs3:"Arabic-native",
    stbTag:"Why now", stbTitle:"Safety isn't a luxury — it's a need", stbSub:"Gym injuries are rising, and Vision 2030 is pushing millions of Saudis into fitness. FitGuard sits right at that moment.",
    stb1n:"Preventable\ninjuries", stb1:"Many gym injuries come from poor form or overloading — and they're preventable",
    stb2n:"Safe\nrecovery", stb2:"Many in MENA recover from sports injuries and need safe training",
    stb3:"Vision 2030 goal: raise activity from 13% to 40% of the population",
    stb4n:"Growing\nmarket", stb4:"Saudi fitness is one of the fastest-growing sectors under Vision 2030",
    stbSrc:"* The Vision 2030 target is from the General Sports Authority. Other points are directional sector trends, to be backed by verified sources before any formal presentation.",
    aiResN:"Leg Press", aiResM:"detected & logged ✓", aiResC:"high confidence",
    aiBadge:"Powered by AI", aiTitle:"Log a workout with one photo",
    aiSub:"No scrolling through long lists — snap a photo and AI does the rest.",
    aiF1t:"Scan gym machines", aiF1p:"Photograph any machine; AI identifies the exercise + muscle and logs it instantly.",
    aiF2t:"Read cardio screens", aiF2p:"Snap the treadmill or bike console and it auto-reads time, distance and calories.",
    aiF3t:"Safe injury swaps", aiF3p:"AI knows your injuries and swaps risky moves for safe ones — automatically.",
    rewTag:"Motivation", rewTitle:"Every workout moves you forward", rewSub:"A rewards system that brings you back daily — built on habit science.",
    rew1t:"Daily streak", rew1p:"Keep training (your walks count too!) and watch your streak grow day by day ",
    rew2t:"XP & levels", rew2p:"Every workout earns XP. Level up and unlock new titles as you go.",
    rew3t:"Badges & achievements", rew3p:"Collect medals for milestones — first workout, 7-day streak, and more.",
    xpLvl:"Level 7 · Warrior", xpStreak:"12-day streak",
    capTag:"AI at the core", capTitle:"AI that understands you — not just logs",
    capSub:"From the first question to your last rep, the AI adapts to you.",
    capSoon:"soon",
    cap1t:"Adaptive engine", cap1p:"Auto-adjusts your program to your readiness, injuries and progress — every day.",
    cap2t:"AI coach that answers", cap2p:"Ask about any exercise or pain and get advice tailored to you, in Arabic.",
    cap3t:"Smart progress analysis", cap3p:"Spots patterns: a lagging muscle, overtraining, or when you need rest.",
    cap4t:"Privacy first", cap4p:"Photo analysis is secure, images aren't stored, and it's PDPL-compliant.",
    acTag:"Your AI coach", acTitle:'An AI coach that knows <span class="hl">you</span> — not generic tips',
    acSub:"Ask anything about your training or diet. It analyzes your specific situation and replies in Arabic — safely.",
    acBotName:"FitGuard Coach", acBotStatus:"Online",
    acQ1:"I only slept 4 hours last night… train or rest?",
    acA1:'Four hours of sleep dropped your readiness to <b>51%</b>. Heavy training today raises injury risk and hurts focus. I\'d do a light session: <b>20 min cardio + stretching</b>, and come back strong tomorrow. Adjust today\'s plan?',
    acChip1:"✅ Adjust my plan", acChip2:"😴 Better-sleep tips",
    acPh:"Ask anything about your training or diet…",
    acBadge:"AI trained on YOUR safety",
    ac1t:"Safety first", ac1p:"Checks the move fits your readiness and injuries before any advice.",
    ac2t:"Knows your full context", ac2p:"Your readiness, history, cycle, and Ramadan — all factored in.",
    ac3t:"Explains every call", ac3p:"Never just ‘do this’ — it tells you why, so you learn.",
    ac4t:"Training + nutrition", ac4p:"Halal meal guidance aligned to your training and daily goals.",
    faqTag:"FAQ", faqTitle:"Everything you need to know",
    faqQ1:"How much does FitGuard cost?", faqA1:"There's a free plan with core features, plus a paid Pro plan priced for the Saudi market. Join early and get 3 months of Pro free.",
    faqQ2:"Is my data and privacy safe?", faqA2:"Yes. Your data is stored securely and complies with Saudi data-protection law (PDPL), and is never shared with third parties — and no mandatory photos.",
    faqQ3:"What is FitGuard?", faqA3:"FitGuard is the first Arabic AI fitness coach that puts safety and injury prevention first — it checks your readiness before every workout and tailors your program to your body and your day.",
    faqQ4:"How does it protect me from injury?", faqA4:"It measures your daily readiness and accounts for past injuries, automatically adjusting intensity and movements, and warns you before you push too hard.",
    faqQ5:"Is there an AI assistant that answers my questions?", faqA5:"Yes — a specialized AI coach answers all your training and nutrition questions, analyzes your specific situation, and explains the reason behind every recommendation.",
    faqQ6:"Is it suitable for women?", faqA6:"Yes. There's a women's program that adapts to menstrual-cycle phases, with culturally-appropriate workouts and full privacy — no mandatory photos.",
    faqQ7:"When does it launch?", faqA7:"Launch is targeted for Saudi Arabia in Q4 2026, with early access via TestFlight for those who join the waitlist.",
    faqQ8:"How do I join the waitlist?", faqA8:"Add your email above and you'll get an early-access invite and a launch notification as soon as it's available.",
    navFeat:"Features", navAcad:"Academy",
    featPTag:"Features", featPTitle:"Everything that protects you — in one app", featPSub:"Daily readiness, AI scanning, a coach that speaks Arabic, a women's program, and your prayer times — all built around your safety.",
    acadTag:"Academy", acadTitle:"Learn to train safely", acadSub:"Short Arabic-first articles on fitness, health, and injury prevention — from the FitGuard team.",
    afAll:"All", afFit:"Fitness", afHealth:"Health", afInjury:"Prevention & Recovery",
    ar1t:"5 warm-up mistakes that lead to injury", ar1p:"The most common pre-workout mistakes — and how to avoid them in 8 minutes.", ar1m:"June 2026 · 5 min read",
    ar2t:"How to pick your first weight at the gym", ar2p:"A simple rule to find a safe starting weight for any exercise — no guessing.", ar2m:"June 2026 · 4 min read",
    ar3t:"Sleep and your results", ar3p:"Why 6 hours of sleep can wipe out a week of effort — and how to recover smart.", ar3m:"May 2026 · 5 min read",
    ar4t:"Back from injury? The safe return plan", ar4p:"When to get back to the iron, at what intensity, and the warning signs.", ar4m:"May 2026 · 6 min read",
    ar5t:"A 3-day split for beginners", ar5p:"A full weekly program that builds strength gradually — without wrecking your joints.", ar5m:"May 2026 · 5 min read",
    ar6t:"Hydration: how much water do you really need?", ar6p:"A simple calculator for your daily needs, plus dehydration signs during training.", ar6m:"April 2026 · 4 min read",
    acadNote:"New articles every week — join the list to get them first.",
    stickyCta:"Reserve my spot — 3 months Pro free",
    rmTag:"Roadmap", rmTitle:"We grow with you — phase by phase", rmSub:"We don't ship everything at once. Each phase masters one thing — and fresh updates keep landing.",
    rm1n:"1", rm1w:"Q4 2026", rm1k:"Launch", rm1f:'<span class=\"rm-chip\">Safety Audit</span><span class=\"rm-chip\">Daily Readiness</span><span class=\"rm-chip\">Adaptive Program</span><span class=\"rm-chip\">Guided Warm-up</span><span class=\"rm-chip\">Prayer Times</span><span class=\"rm-chip\">Women&#39;s Basics</span>', rm1g:"Protection first — every feature here makes sure your body is ready before you touch the iron.",
    rm2n:"2", rm2w:"POST-LAUNCH", rm2k:"Engagement", rm2f:'<span class=\"rm-chip\">Arabic AI Coach</span><span class=\"rm-chip\">AI Scan</span><span class=\"rm-chip\">Badges & Streaks</span><span class=\"rm-chip\">Muscle Map</span><span class=\"rm-chip\">Ramadan Mode</span>', rm2g:"Training becomes a daily habit — an AI by your side, streaks that motivate, Ramadan accounted for.",
    rm3n:"3", rm3w:"2027", rm3k:"Expansion", rm3f:'<span class=\"rm-chip\">Full FitGuard For Her</span><span class=\"rm-chip\">Cycle Intelligence</span><span class=\"rm-chip\">In-app Academy</span><span class=\"rm-chip\">Halal Nutrition</span><span class=\"rm-chip\">Home Alternatives</span>', rm3g:"Deeper experiences for every segment — with a full identity of her own for women.",
    rm4n:"4", rm4w:"FUTURE", rm4k:"Growth", rm4f:'<span class=\"rm-chip\">Referral Program</span><span class=\"rm-chip\">Advanced Progress Reports</span><span class=\"rm-chip\">Gym & Physio Partnerships</span><span class=\"rm-chip\">GCC Expansion</span><span class=\"rm-chip\">Android</span>', rm4g:"From an app to a safe-fitness ecosystem in Arabic — across the Gulf.",
    showTitle:"Built for real iron", showSub:"Gym training with weights, sets and progression — not just another home app.",
    vizTag:"Smart tracking", vizTitle:"Watch your progress grow", vizSub:"Live charts for every lift, training volume, and the muscles you hit.",
    chartT:"Safety score over time", chartS:"Last 8 weeks",
    volT:"Weekly training volume", volS:"kg lifted · climbing every week",
    figT:"Muscle activation map", figS:"Every exercise lights the right muscle — anatomically accurate",
    gapTag:"The gap", gapTitle:"Every fitness app is built for someone else",
    gapSub:"You download a foreign, English-only app that doesn't know your schedule, your prayers, or your injuries. FitGuard is the first built for you.",
    gap1t:"✗ Current apps", gap1p:"English, one-size-fits-all, no injury screening, blind to your culture.",
    gap2t:"✗ A personal trainer", gap2p:"Expensive, not available 24/7, and quality varies wildly.",
    gap3t:"✦ FitGuard", gap3p:"100% Arabic, screens your readiness & injuries, respects your time & prayers, adapts to you.",
    gapHl:'No Arabic fitness app combines <span class="hl">safety + intelligence + culture</span> in one place. Until now.',
    storyTag:"The story", storyTitle:"Why we built FitGuard",
    sc1n:"1", sc2n:"2", sc3n:"3", sc4n:"4",
    sc1k:"The start", sc1t:"You hit the gym pumped… and walked out injured.", sc1p:"A story that repeats daily: too much hype, more weight than you're ready for, poor form — and weeks of pain that stop you cold.",
    sc2k:"The problem", sc2t:"Every app hands you workouts… none asks if your body's ready.", sc2p:"One-size-fits-all, no injury screening, no sense of your day. You train without knowing if today is even the right day.",
    sc3k:"The shift", sc3t:'We flipped it: <span class="hl">safety first, before the iron.</span>', sc3p:"FitGuard checks your readiness daily, reads your condition, and shapes your workout around your body — not the other way round. The first coach that decides with you when and how to train, safely.",
    sc4k:"The promise", sc4t:"Train smart, go further, stay protected.", sc4p:"Not just a workout app — a partner that protects you from injury and builds your strength for the long run. So you keep going, not stop.",
    howTag:"How it works", howTitle:"3 steps that protect you from injury", howSub:"FitGuard doesn't hand you random workouts — it decides with you when to train, how, and how hard.",
    s1n:"STEP 01", s1t:"Safety Audit", s1p:"6 smart questions map your level and injuries, then build a safe program.",
    s2n:"STEP 02", s2t:"Daily Readiness", s2p:"Each morning we read your sleep, stress and soreness — train or rest.",
    s3n:"STEP 03", s3t:"Adaptive program", s3p:"A real gym split that adjusts automatically to your readiness and injuries.",
    featTag:"Built for you", featTitle:"Things you won't find in any other app", featSub:"These aren't add-ons — they're the reason FitGuard is yours.",
    excl:"Exclusive",
    f1t:"Prayer-time aware", f1p:"Schedules your workout around prayer automatically and nudges you in the right window.",
    f2t:"Ramadan mode", f2p:"Fasting-adapted training — post-Iftar timing, lower intensity, hydration & nutrition.",
    f3t:"Women's program + cycle tracker", f3p:"Culturally appropriate workouts that adapt to your cycle phase.",
    f4t:"Auto injury modification", f4p:"Knee pain or past surgery? We swap risky moves for safe ones instantly.",
    f5t:"Muscle map", f5p:"See exactly which muscle each exercise works — with real anatomical accuracy.",
    f6t:"Track your progress", f6p:"Daily streak, badges, and your walking counts too — every move matters.",
    prTag:"Exclusive · first to do it", prTitle:'Training that respects <span class="hl">your prayer times</span>',
    prSub:"FitGuard knows the prayer times in your city and schedules your workout around them automatically — train and pray without missing either.",
    prP1:"Accurate times for your location (Umm al-Qura & more).",
    prP2:"Nudges you to the best workout window between prayers.",
    prP3:"Auto-pauses the timer at adhan if you want.",
    prNextLbl:"Next prayer", prNextName:"Asr", prNextCd:"in 45 min",
    prF:"Fajr", prD:"Dhuhr", prA:"Asr", prM:"Maghrib", prI:"Isha",
    prWindow:"💡 You have <b>45 min</b> before Asr — perfect for a quick session.",
    wmHer:"For Her", wmTag:"Exclusive · made for her", wmTitle:'A women\'s program <span class="hl">that gets your body</span>',
    wmSub:"Culturally appropriate workouts that adapt to your cycle phases — higher intensity when your energy peaks, gentler when you need it.",
    wmP1:"Built-in cycle tracker tunes workout intensity.",
    wmP2:"Home-friendly, appropriate workouts, fully private.",
    wmP3:"A theme and experience designed for women.",
    cyPhase:"Ovulation", cyDay:"Day 14",
    cyP1:"Menstrual", cyP2:"Ovulation", cyP3:"Follicular", cyP4:"Luteal",
    visTag:"Vision 2030", visTitle:"Aligned with the Kingdom's sports agenda",
    visP:"The goal of raising physical activity from 13% to 40% by 2030 — FitGuard is a tool that helps, safely.",
    visStat:"annual growth of Saudi Arabia's fitness sector",
    joinTag:"Join now", joinTitle:"Be the first to try FitGuard",
    joinP:"Drop your email and we'll send you a TestFlight invite before launch + 3 months of Pro, free.",
    joinNote:"🔒 No spam. Your email is stored securely (PDPL-compliant).",
    footTag:"Train Smart. Stay Safe. · تدرّب بذكاء. ابقَ محمياً.",
    fPrivacy:"Privacy", fTerms:"Terms", fContact:"Contact",
    medical:"Medical notice: FitGuard content is for fitness and information only and is not medical advice. Consult a professional before starting any exercise program, especially with an injury or health condition. Readiness and injury features are guidance and do not replace a doctor's opinion.",
    trustTag:"Why trust us", trustTitle:"Built on safety and privacy",
    t1t:"Physio-grade principles", t1p:"Every recommendation is grounded in injury-prevention science and safe-training best practices — not just an algorithm.",
    t2t:"Full privacy (PDPL)", t2p:"Your data is stored securely, compliant with Saudi data-protection law, and never shared with anyone.",
    t3t:"Built in Saudi Arabia", t3p:"Made locally — it understands your language, culture, prayer times and Ramadan. No imported translation.",
    msgOk:"✓ You're on the list! We'll send your invite soon.", msgDup:"✓ You're already signed up!", msgErr:"Something went wrong, please try again.", msgInvalid:"Please check your email format.", msgSending:"Sending…", msgDone:"✓ Done",
    tyTitle:"You're in! 🎉", tySub:"We'll send a TestFlight invite before launch + 3 months of Pro, free. Keep an eye on your inbox.",
    tyDupTitle:"Already signed up ✓", tyDupSub:"Your email is on file — we'll send your invite as soon as it's ready.",
    refTitle:"Share your link with friends", refSub:"Our referral rewards program launches at release 🎁",
    refCopy:"Copy", refCopied:"Copied ✓", refAria:"Your referral link"
  }
};

/* ─── Supabase config ───────────────────────────────────────────────────────
   SUPABASE_ANON is the PUBLIC publishable/anon key — it is designed to live in
   the front-end and is protected by Row Level Security. It is NOT a secret.
   NEVER put the service_role key here. ───────────────────────────────────── */
const SUPABASE_URL  = "https://pxhdptebzbudswrkgapf.supabase.co";
const SUPABASE_ANON = "sb_publishable_T8V39HVugJIhJfeXqubSqg_6HQ8Oqj5";

/* Google "Sign in with Google" Client ID (OAuth 2.0 Web client).
   Create at console.cloud.google.com → APIs & Services → Credentials.
   Add Authorized JavaScript origins: https://www.fitguardapp.com and https://fitguardapp.com
   Until a real ID is set here, the Google button stays hidden (graceful no-op). */
const GOOGLE_CLIENT_ID = "PASTE_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* Capture traffic source: UTM campaign if present, else the referrer host, else 'direct'. */
function trafficSource(){
  try{
    const q = new URLSearchParams(location.search);
    const utm = q.get('utm_source');
    if(utm) return (q.get('utm_campaign') ? `${utm}/${q.get('utm_campaign')}` : utm).slice(0,120);
    if(document.referrer){ try{ return new URL(document.referrer).hostname.slice(0,120); }catch{ return 'referral'; } }
    return 'direct';
  }catch{ return 'direct'; }
}

let LANG = (function(){try{return localStorage.getItem("fg-lang")||"ar"}catch(e){return "ar"}})();
function applyLang(l){
  LANG = l;
  const d = T[l];
  document.body.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", l);
  document.querySelectorAll("[data-i]").forEach(el=>{
    const v = d[el.getAttribute("data-i")];
    if(v!=null) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-ph]").forEach(el=>{
    const v = d[el.getAttribute("data-i-ph")];
    if(v!=null) el.placeholder = v;
  });
  document.querySelectorAll("[data-i-al]").forEach(el=>{
    const v = d[el.getAttribute("data-i-al")];
    if(v!=null) el.setAttribute("aria-label", v);
  });
  // prayer cells
  document.querySelectorAll("[data-pray]").forEach(box=>{
    box.innerHTML = d.pray.map(p=>`<div class="pc${p[2]?' on':''}"><div class="n">${p[0]}</div><div class="t">${p[1]}</div></div>`).join("");
  });
  document.getElementById("langToggle").textContent = l === "ar" ? "EN" : "عربي";
  try{localStorage.setItem("fg-lang",l)}catch(e){}
}
document.getElementById("langToggle").onclick = ()=>applyLang(LANG==="ar"?"en":"ar");

/* ─── Waitlist submit → Supabase ─── */
async function submitEmail(email){
  try{
    const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`,{
      method:"POST",
      headers:{ "Content-Type":"application/json", apikey:SUPABASE_ANON,
        Authorization:`Bearer ${SUPABASE_ANON}`, Prefer:"return=minimal" },
      body:JSON.stringify({ email, lang:LANG, referrer: trafficSource() })
    });
    if(res.status===201 || res.ok) return {ok:true};
    if(res.status===409) return {ok:true, dup:true}; // duplicate email (unique constraint)
    return {ok:false};
  }catch{ return {ok:false}; }
}

document.querySelectorAll("form[data-wl]").forEach(form=>{
  form.addEventListener("submit", async e=>{
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const hp = form.querySelector('.js-hp');
    const btn = form.querySelector("button");
    const msg = form.parentElement.querySelector("[data-msg]");
    const d = T[LANG];

    // honeypot: if a bot filled the hidden field, drop silently (fake success)
    if(hp && hp.value){ msg.textContent = d.msgOk; msg.className = "form-msg ok"; input.value = ""; return; }

    const email = input.value.trim();
    if(!isValidEmail(email)){ msg.textContent = d.msgInvalid; msg.className = "form-msg err"; return; }

    btn.disabled = true;
    const prevBtn = btn.textContent; btn.textContent = d.msgSending;
    const r = await submitEmail(email);
    if(r.ok){
      input.value = "";
      if(!r.dup && window.plausible) plausible('waitlist_signup'); // analytics (TASK 2)
      // Celebratory thank-you state (replaces the form)
      showThankYou(form, r.dup, email);
    }else{
      msg.textContent = d.msgErr; msg.className = "form-msg err";
      btn.disabled = false; btn.textContent = prevBtn;
    }
  });
});

/* Stable short referral code derived from the email (UI stub — backend wires later). */
function refCode(seed){ let h=0; for(let i=0;i<seed.length;i++){ h=(h*31+seed.charCodeAt(i))>>>0; } return h.toString(36).slice(0,6).padStart(4,'0'); }

/* Swap the form for a thank-you panel (with referral hook) after a successful signup. */
function showThankYou(form, isDup, email){
  const d = T[LANG];
  const link = `fitguardapp.com/?ref=${refCode(email || ('x'+Date.now()))}`;
  const panel = document.createElement('div');
  panel.className = 'thanks animate-pop';
  panel.setAttribute('role','status');
  panel.innerHTML =
    `<div class="thanks-check">✓</div>
     <div class="thanks-title">${isDup ? d.tyDupTitle : d.tyTitle}</div>
     <div class="thanks-sub">${isDup ? d.tyDupSub : d.tySub}</div>
     <div class="ref">
       <div class="ref-h">${d.refTitle}</div>
       <div class="ref-row">
         <input class="ref-link" type="text" readonly value="${link}" aria-label="${d.refAria}"/>
         <button type="button" class="ref-copy">${d.refCopy}</button>
       </div>
       <div class="ref-sub">${d.refSub}</div>
     </div>`;
  // hide the form + its inline message, show the panel in place
  form.style.display = 'none';
  const msg = form.parentElement.querySelector('[data-msg]');
  if(msg){ msg.textContent=''; }
  form.insertAdjacentElement('afterend', panel);
  // wire the copy button (graceful fallback if Clipboard API unavailable)
  const copyBtn = panel.querySelector('.ref-copy'), linkInput = panel.querySelector('.ref-link');
  copyBtn.addEventListener('click', ()=>{
    const done = ()=>{ copyBtn.textContent = d.refCopied; copyBtn.classList.add('done');
      setTimeout(()=>{ copyBtn.textContent = d.refCopy; copyBtn.classList.remove('done'); }, 2000); };
    const url = 'https://' + link;
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(done).catch(()=>{ try{ linkInput.select(); document.execCommand('copy'); }catch(e){} done(); });
    } else { try{ linkInput.select(); document.execCommand('copy'); }catch(e){} done(); }
  });
}

applyLang(LANG);

/* "Sign up with Google" (Google Identity Services) — lightweight, no backend.
   Decodes the verified email from Google's ID token and adds it to the waitlist
   via the existing submitEmail + showThankYou flow. Stays hidden (no-op) until
   GOOGLE_CLIENT_ID is configured, so it can ship safely before setup. */
(function(){
  if(!GOOGLE_CLIENT_ID || /^PASTE_/.test(GOOGLE_CLIENT_ID)) return;       // not configured yet
  const forms = [...document.querySelectorAll('form[data-wl]')];
  if(!forms.length) return;
  // inject a Google button + "or" divider above each waitlist form
  forms.forEach(f=>{
    const wrap=document.createElement('div'); wrap.className='gsignin';
    wrap.innerHTML='<div class="g-btn" data-g-btn></div><div class="g-or"><span>'+(LANG==='ar'?'أو':'or')+'</span></div>';
    f.insertAdjacentElement('beforebegin', wrap);
  });
  const decodeJwt=(t)=>{ try{ return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); }catch(e){ return null; } };
  const onCred=async(resp)=>{
    const info=decodeJwt(resp.credential); if(!info || !info.email) return;
    const r=await submitEmail(info.email);
    if(r.ok){
      if(!r.dup && window.plausible) plausible('waitlist_signup_google');
      forms.forEach(f=>{ if(getComputedStyle(f).display!=='none') showThankYou(f, r.dup, info.email); });
    }
  };
  const s=document.createElement('script'); s.src='https://accounts.google.com/gsi/client'; s.async=true; s.defer=true;
  s.onload=()=>{
    if(!window.google || !google.accounts) return;
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onCred, ux_mode:'popup' });
    document.querySelectorAll('[data-g-btn]').forEach(el=>{
      google.accounts.id.renderButton(el, { type:'standard', theme:'filled_black', size:'large', shape:'pill', text:'signup_with', width:320, locale:LANG });
    });
  };
  document.head.appendChild(s);
})();

/* Sticky mobile CTA: appears once the page-top section scrolls away,
   hides while the #join section is on screen. Injected from JS (shared
   across pages); button label localizes via data-i like everything else. */
(function(){
  const join=document.getElementById('join'); if(!join) return;
  const bar=document.createElement('div'); bar.className='sticky-cta';
  bar.innerHTML='<button type="button" class="sticky-cta-btn" data-i="stickyCta"></button>';
  document.body.appendChild(bar);
  const btn=bar.querySelector('button');
  btn.textContent=(T[LANG]&&T[LANG].stickyCta)||'';
  btn.addEventListener('click',()=>join.scrollIntoView({behavior:'smooth'}));
  let topGone=false, joinVisible=false;
  const update=()=>bar.classList.toggle('on', topGone && !joinVisible);
  const top=document.querySelector('.hero, .page-hero, .acad');
  if(top){
    new IntersectionObserver(es=>{topGone=!es[0].isIntersecting;update();},{threshold:0}).observe(top);
  } else { topGone=true; }
  new IntersectionObserver(es=>{joinVisible=es[0].isIntersecting;update();},{threshold:0.2}).observe(join);
})();

/* Academy: article filter (one delegated listener; no-op on other pages) */
(function(){
  const bar=document.querySelector('.acad-filter'); if(!bar) return;
  bar.addEventListener('click',(e)=>{
    const b=e.target.closest('.af'); if(!b) return;
    bar.querySelectorAll('.af').forEach(x=>x.classList.toggle('on',x===b));
    document.querySelectorAll('.ag-card').forEach(c=>{
      c.hidden = b.dataset.cat!=='all' && c.dataset.cat!==b.dataset.cat;
    });
  });
})();

/* ═══════════ DYNAMIC / MOTION ENGINE ═══════════ */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Smart-coach auto-typed demo. Progressive enhancement: the full exchange is
   in the HTML (SEO + no-JS + reduced-motion all see it). When motion is allowed
   and the chat scrolls in, we hide it, type the question, show a typing
   indicator, then reveal the coach's reply + chips. Runs once. */
(function(){
  const chat=document.getElementById('acChat'); if(!chat || reduce) return;
  const userMsg=document.getElementById('acUserMsg'),
        typing=document.getElementById('acTyping'),
        aiMsg=document.getElementById('acAiMsg'),
        chips=document.getElementById('acChips');
  if(!userMsg||!typing||!aiMsg||!chips) return;
  // hide the scripted bits up front (so there's no flash before typing starts)
  const hide=()=>{ userMsg.textContent=''; userMsg.style.opacity='0';
    typing.style.display='none'; aiMsg.style.display='none';
    chips.style.opacity='0'; chips.style.transition='opacity .45s ease'; };
  hide();
  let done=false;
  const run=()=>{
    if(done) return; done=true;
    const d=T[LANG], userText=(d&&d.acQ1)||'', aiHTML=(d&&d.acA1)||aiMsg.innerHTML;
    const caret=document.createElement('span'); caret.className='ac-caret';
    userMsg.style.opacity='1'; userMsg.appendChild(caret);
    let i=0;
    const typeUser=()=>{ userMsg.textContent=userText.slice(0,++i); userMsg.appendChild(caret);
      if(i<userText.length) setTimeout(typeUser, 34);
      else { caret.remove(); setTimeout(showTyping, 480); } };
    const showTyping=()=>{ typing.style.display='inline-flex'; setTimeout(showAi, 1250); };
    const showAi=()=>{ typing.style.display='none'; aiMsg.style.display=''; aiMsg.innerHTML=aiHTML;
      setTimeout(()=>{ chips.style.opacity='1'; }, 550); };
    typeUser();
  };
  const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ run(); io.disconnect(); } }); },{threshold:0.4});
  io.observe(chat);
})();

if(!reduce){
  /* 1. Scroll reveal */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:0.15, rootMargin:'0px 0px -8% 0px' });
  document.querySelectorAll('.reveal, .step, .vision').forEach(el=>io.observe(el));

  /* 2. Numeric count-ups: all unified on the [data-count-to] engine (runCounters). */

  /* 3. Scroll progress bar */
  const prog=document.getElementById('scrollProg');
  const onScroll=()=>{ const h=document.documentElement; const sc=h.scrollTop/(h.scrollHeight-h.clientHeight);
    prog.style.width=(sc*100)+'%'; };
  document.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* 4. Subtle parallax on hero orbs */
  const orbs=document.querySelectorAll('.orb');
  document.addEventListener('scroll', ()=>{ const y=window.scrollY;
    orbs.forEach((o,i)=>{ o.style.transform=`translateY(${y*(0.04+i*0.02)}px)`; });
  }, {passive:true});

  /* 5. Phone screen carousel (readiness → split → scanner) */
  let curScreen=0;
  const screens=document.querySelectorAll('.ph-screen');
  const dots=document.querySelectorAll('.ph-dot');
  if(screens.length){
    setInterval(()=>{
      curScreen=(curScreen+1)%screens.length;
      screens.forEach((s,i)=>s.classList.toggle('active', i===curScreen));
      dots.forEach((d,i)=>d.classList.toggle('on', i===curScreen));
    }, 2200);
  }

  /* 6. Card tilt on pointer move */
  document.querySelectorAll('.fc').forEach(card=>{
    card.addEventListener('pointermove',(e)=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
      card.style.transform=`perspective(600px) rotateY(${px*7}deg) rotateX(${-py*7}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave',()=>{ card.style.transform=''; });
  });

  /* 7. Magnetic primary buttons */
  document.querySelectorAll('.wait button, .nav-cta').forEach(btn=>{
    btn.addEventListener('pointermove',(e)=>{
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.18}px, ${(e.clientY-r.top-r.height/2)*0.3}px)`;
    });
    btn.addEventListener('pointerleave',()=>{ btn.style.transform=''; });
  });

  /* 8b. Stat card spotlight follows cursor */
  document.querySelectorAll('.statc').forEach(card=>{
    card.addEventListener('pointermove',(e)=>{
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
      card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
    });
  });

  /* 8c. GLOBAL particle field — colour + motion morph to the section in view */
  const gcv=document.getElementById('globalParticles');
  const cg=document.getElementById('cursorGlow');
  if(gcv && !reduce){
    const gctx=gcv.getContext('2d'); let GW,GH,gp; const m={x:-999,y:-999};
    const rgbOf=(w)=>{ const z=(w||'').match(/(\d+)\D+(\d+)\D+(\d+)/); return z?[+z[1],+z[2],+z[3]]:[255,150,60]; };
    // each section gets a motion "mode" → distinct feel, not just colour
    const modeFor=(c)=> /ai-sec/.test(c)?'data' : /spot-women/.test(c)?'soft'
      : /spot-prayer/.test(c)?'serene' : /\bfinal\b/.test(c)?'celebrate'
      : /statband|\bstory\b/.test(c)?'embers' : 'drift';
    const MODES={
      drift:    {count:.9, speed:.55,dir:-.15,size:1.05,glow:7, twk:.15},
      embers:   {count:1,  speed:1,  dir:-1,  size:1,  glow:9, twk:0},
      data:     {count:1,  speed:.85,dir:0,   size:.8, glow:5, twk:1},
      soft:     {count:.6, speed:.45,dir:-.4, size:1.8,glow:13,twk:.35},
      serene:   {count:.5, speed:.5, dir:-1,  size:1.1,glow:10,twk:.25},
      celebrate:{count:1.1,speed:1.4,dir:-1,  size:1,  glow:11,twk:.4}
    };
    // vivid, distinct colour per section (boost dim washes so the change is obvious)
    const boost=(c)=>{ const mx=Math.max(c[0],c[1],c[2])||1, k=Math.min(2.8,238/mx);
      return [Math.min(255,c[0]*k),Math.min(255,c[1]*k),Math.min(255,c[2]*k)]; };
    const zones=[...document.querySelectorAll('[data-wash]')].map(el=>(
      {el,col:boost(rgbOf(el.getAttribute('data-wash'))),mode:modeFor(el.className)}));
    const cur={col:[255,150,60],count:1,speed:1,dir:-1,size:1,glow:9,twk:0};
    const tgt={...cur,col:[255,150,60]};
    const wash=document.getElementById('colorwash');
    const setZone=(z)=>{ tgt.col=z.col.slice(); const M=MODES[z.mode];
      tgt.count=M.count;tgt.speed=M.speed;tgt.dir=M.dir;tgt.size=M.size;tgt.glow=M.glow;tgt.twk=M.twk;
      const R=z.col[0]|0,G=z.col[1]|0,B=z.col[2]|0;
      if(cg) cg.style.setProperty('--cg',`rgba(${R},${G},${B},.2)`);
      if(wash){ wash.style.setProperty('--wash',`rgba(${R},${G},${B},.16)`);
                wash.style.setProperty('--wash2',`rgba(${R},${G},${B},.09)`); } };
    // active zone = whichever section straddles viewport centre, checked every few frames.
    // (Lenis smooth-scroll can defer IntersectionObserver, so we measure directly instead.)
    let zoneIdx=-1;
    const pickZone=()=>{ const cy=innerHeight*0.5;
      for(let i=0;i<zones.length;i++){ const r=zones[i].el.getBoundingClientRect();
        if(r.top<=cy && r.bottom>=cy){ if(i!==zoneIdx){ zoneIdx=i; setZone(zones[i]); } return; } } };
    pickZone();
    const sizeUp=()=>{ GW=gcv.width=innerWidth; GH=gcv.height=innerHeight;
      const n=Math.min(120, Math.floor(GW/16));
      gp=Array.from({length:n},()=>({x:Math.random()*GW,y:Math.random()*GH,
        r:Math.random()*2.4+0.8, base:Math.random()*0.45+0.3, ph:Math.random()*6.28,
        vy:-(Math.random()*0.28+0.06), vx:(Math.random()-0.5)*0.3})); };
    sizeUp(); addEventListener('resize',sizeUp,{passive:true});
    addEventListener('pointermove',e=>{ m.x=e.clientX; m.y=e.clientY; },{passive:true});
    addEventListener('pointerleave',()=>{ m.x=-999; m.y=-999; });
    let tk=0, fc=0;
    (function gdraw(){ tk+=0.016; if((fc++ % 6)===0) pickZone();
      for(let i=0;i<3;i++) cur.col[i]+=(tgt.col[i]-cur.col[i])*0.05;
      cur.count+=(tgt.count-cur.count)*0.05; cur.speed+=(tgt.speed-cur.speed)*0.05;
      cur.dir+=(tgt.dir-cur.dir)*0.05; cur.size+=(tgt.size-cur.size)*0.05;
      cur.glow+=(tgt.glow-cur.glow)*0.05; cur.twk+=(tgt.twk-cur.twk)*0.05;
      gctx.clearRect(0,0,GW,GH);
      const R=Math.round(cur.col[0]),Gc=Math.round(cur.col[1]),B=Math.round(cur.col[2]);
      const vis=Math.floor(gp.length*cur.count), sway=1-Math.min(1,Math.abs(cur.dir));
      for(let i=0;i<vis;i++){ const p=gp[i];
        const dx=p.x-m.x, dy=p.y-m.y, d2=dx*dx+dy*dy;
        if(d2<34000){ const f=(34000-d2)/34000; const d=Math.sqrt(d2)||1; p.x+=dx/d*f*11; p.y+=dy/d*f*11; }
        p.y += cur.dir*Math.abs(p.vy)*cur.speed*2.4;
        p.x += p.vx*cur.speed + Math.sin(tk+p.ph)*0.25*sway;
        if(p.y<-8){p.y=GH+8;p.x=Math.random()*GW;} if(p.y>GH+8){p.y=-8;p.x=Math.random()*GW;}
        if(p.x<-8)p.x=GW+8; if(p.x>GW+8)p.x=-8;
        const tw = cur.twk ? (1-cur.twk*0.55 + cur.twk*0.55*Math.sin(tk*2.6+p.ph)) : 1;
        gctx.beginPath(); gctx.arc(p.x,p.y,p.r*cur.size,0,7);
        gctx.fillStyle=`rgba(${R},${Gc},${B},${(p.base*tw).toFixed(3)})`;
        gctx.shadowBlur=cur.glow; gctx.shadowColor=`rgba(${R},${Gc},${B},.6)`; gctx.fill();
      }
      requestAnimationFrame(gdraw); })();
  }

  /* 8d. Cursor glow + 3D card tilt — the page reacts to the mouse everywhere */
  if(!reduce && matchMedia('(hover:hover)').matches){
    if(cg){ let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty,shown=false;
      addEventListener('pointermove',e=>{ tx=e.clientX; ty=e.clientY;
        if(!shown){ shown=true; cg.classList.add('on'); } },{passive:true});
      (function move(){ cx+=(tx-cx)*0.15; cy+=(ty-cy)*0.15;
        cg.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;
        requestAnimationFrame(move); })();
    }
    document.querySelectorAll('.gap-card,.feat,.step,.prayer-cell,.ai-feat,.cycle-card,.fc,.aicap,.rewc')
      .forEach(el=>{
        el.addEventListener('pointerenter',()=>el.classList.add('tilting'));
        el.addEventListener('pointermove',(e)=>{ const r=el.getBoundingClientRect();
          const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
          el.style.transform=`perspective(820px) rotateX(${(-py*7).toFixed(2)}deg) rotateY(${(px*9).toFixed(2)}deg) translateY(-5px)`;
        });
        el.addEventListener('pointerleave',()=>{ el.style.transform='';
          setTimeout(()=>el.classList.remove('tilting'),260); });
      });
  }
}

/* 8. Hero headline word-by-word (runs after each language render) */
function animateHeadline(){
  const h1=document.querySelector('h1'); if(!h1) return;
  if(reduce) return;
  // wrap each top-level word/segment that isn't already a span, plus the .hl span
  h1.querySelectorAll('.hl').forEach(s=>s.classList.add('word-anim'));
  // wrap plain text nodes into word spans
  [...h1.childNodes].forEach(n=>{
    if(n.nodeType===3 && n.textContent.trim()){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(w=>{
        if(/^\s+$/.test(w)){ frag.appendChild(document.createTextNode(w)); }
        else if(w){ const sp=document.createElement('span'); sp.className='word-anim'; sp.textContent=w; frag.appendChild(sp); }
      });
      n.replaceWith(frag);
    }
  });
  h1.querySelectorAll('.word-anim').forEach((s,i)=>{ s.style.animationDelay=(i*0.09)+'s'; });
}

/* 9. Reusable count-up engine — [data-count-to] elements.
   ease-out-expo, localized numerals (Eastern-Arabic in AR), shared IO,
   runs once, reduced-motion → instant final value, zero CLS (final value
   is baked into the HTML so crawlers/no-JS see a real number). */
function fmtNum(n, lang){ return new Intl.NumberFormat((lang||LANG)==='ar'?'ar-SA':'en-US').format(n); }
/* data-numlocale="en" pins an element to Western digits (e.g. when a static
   LTR prefix like "13% → " would otherwise mix numeral systems). */
function runCounters(){
  const els=[...document.querySelectorAll('[data-count-to]')];
  if(!els.length) return;
  const setFinal=(el)=> el.textContent=(el.dataset.prefix||'')+fmtNum(parseFloat(el.dataset.countTo),el.dataset.numlocale)+(el.dataset.suffix||'');
  if(reduce){ els.forEach(setFinal); return; }
  const animate=(el)=>{
    const to=parseFloat(el.dataset.countTo), from=parseFloat(el.dataset.countFrom||'0');
    const pre=el.dataset.prefix||'', suf=el.dataset.suffix||'', loc=el.dataset.numlocale;
    const dur=parseInt(el.dataset.duration||'1500',10), t0=performance.now();
    const tick=(t)=>{ const p=Math.min(1,(t-t0)/dur);
      const e=p>=1?1:1-Math.pow(2,-10*p);                 // ease-out-expo
      el.textContent=pre+fmtNum(Math.round(from+(to-from)*e),loc)+suf;
      if(p<1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io=new IntersectionObserver((ents)=>{ ents.forEach(e=>{ if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } }); },{threshold:0.4});
  els.forEach(el=>io.observe(el));
}
/* Re-localize finished counters when the language toggles (no re-animation). */
function relocalizeCounters(lang){
  document.querySelectorAll('[data-count-to]').forEach(el=>{
    el.textContent=(el.dataset.prefix||'')+fmtNum(parseFloat(el.dataset.countTo),el.dataset.numlocale||lang)+(el.dataset.suffix||'');
  });
}

/* 10. Trust marquee content (duplicated for seamless loop) */
function buildMarquee(){
  const track=document.getElementById('marqTrack'); if(!track) return;
  const items = LANG==='ar'
    ? ['فحص السلامة','أوقات الصلاة','وضع رمضان','برنامج نسائي','خريطة العضلات','مسح بالذكاء','أوسمة ومكافآت','نقاط ومستويات','رؤية ٢٠٣٠']
    : ['Safety Audit','Prayer Times','Ramadan Mode','Women\'s Track','Muscle Map','AI Scan','Badges & Rewards','XP & Levels','Vision 2030'];
  const html = items.map(i=>`<span class="marq-item">${i}</span>`).join('');
  track.innerHTML = html + html; // duplicate for -50% loop
}

// (Reduced-motion final values are handled inside runCounters.)

// run dynamic bits after first render + on each language switch
animateHeadline(); buildMarquee(); runCounters();
const _origApply = applyLang;
applyLang = function(l){ _origApply(l); animateHeadline(); buildMarquee(); relocalizeCounters(l); };

/* ═══════════ SCROLL DEPTH + COLOR WASH ENGINE ═══════════
   Loads after Lenis + GSAP are ready. Fully optional: if the CDN libs fail or
   the user prefers reduced motion, the site stays exactly as-is. */
(function initDepth(){
  if(reduce) return;
  let tries = 0;
  const ready = () => window.Lenis && window.gsap && window.ScrollTrigger;
  const start = () => {
    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    // 1) Smooth scroll (Lenis) ↔ ScrollTrigger sync
    const lenis = new window.Lenis({ duration: 1.0, smoothWheel: true, wheelMultiplier: 1.0,
      easing: (t)=> 1 - Math.pow(1 - t, 3) });
    window.__lenis = lenis; // exposed for debugging
    lenis.on('scroll', window.ScrollTrigger.update);
    gsap.ticker.add((t)=> lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    // 2) Color wash transitions — fade the fixed bg layer to each section's hue
    const wash = document.getElementById('colorwash');
    document.querySelectorAll('[data-wash]').forEach((sec)=>{
      const c = sec.getAttribute('data-wash');
      window.ScrollTrigger.create({
        trigger: sec, start: 'top 60%', end: 'bottom 40%',
        onEnter:     ()=> wash.style.setProperty('--wash', c),
        onEnterBack: ()=> wash.style.setProperty('--wash', c),
      });
    });

    // 3) Depth parallax — layers drift at different speeds for a 3D feel
    document.querySelectorAll('.orb').forEach((o,i)=>{
      gsap.to(o, { yPercent: 18 + i*10, ease:'none',
        scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
    });
    const phone = document.querySelector('.phone');
    if(phone){
      gsap.to(phone, { yPercent: -8, ease:'none',
        scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
    }
    // NOTE: section-title rise is handled by the CSS .reveal IntersectionObserver.
    // A second GSAP transform here fought the same property → caused title/sub overlap.

    // Story is now a flowing vertical timeline — chapters reveal via the
    // shared .reveal IntersectionObserver; no scroll-pinning needed.
  };
  const wait = setInterval(()=>{
    if(ready()){ clearInterval(wait); start(); }
    else if(++tries > 40){ clearInterval(wait); } // ~6s → give up silently, site fine
  }, 150);
})();
