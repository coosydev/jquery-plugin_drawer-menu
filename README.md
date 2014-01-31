# drawer-menu
drawer-menuは左右からスライドで現れるメニューを実装するためのjQueryプラグインです。実装には jQuery 1.9以上が必要です。

# サポート
* Android2.3 以降
* iOS6 以降

※ PCでも使用できますがサポートは現在行っておりません。

# 必要なファイル
* jQuery 1.9 以上
* jquery.drawer-menu.js (drawer-menu 本体)
* jquery.drawer-menu.css (drawer-menu 付属CSS)

# 簡単な使い方
`jquery.drawer-menu.js` をダウンロードして使用するHTMLにjQueryを読み込んだ後にインクルードしてください。
<pre><code>&lt;script type="text/javascript" src="jquery.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="jquery.drawer-menu.js"&gt;&lt;/script&gt;</code></pre>

`jquery.drawer-menu.css` をダウンロードして使用するHTMLにインクルードしてください。実装を簡単に行えるように必要なスタイルを指定しています。最低限必要なクラスしか指定しておりません。過不足があればCSSスタイルを追記してください。下記「CSSの設定」に例としてCSSの設定方法を記載しているので参照してください。
CSSでは下記のクラスを定義しています。

* .drawer-menu-body : ページコンテンツ、メニューの親になる要素に対してのスタイルクラス  
* .drawer-menu-page : ページコンテンツに対してのスタイルクラス
* .drawer-menu-panels : メニューに対してのスタイル
* .drawer-menu-panel : サブメニューに対してのスタイル

## HTMLの記述

<pre><code>&lt;head&gt;
&lt;link href="jquery.drawer-menu.css" type="text/css" rel="stylesheet" &gt;
&lt;/head&gt;

&lt;body class="drawer-menu-body"&gt;
	&lt;div class="drawer-menu-page"&gt;
		&lt;p&gt;
			&lt;input type="button" onclick="$('#drawer-menu').drawer_menu('toggle')" value="メニュー" /&gt;
		&lt;/p&gt;
		&lt;p&gt;ページコンテンツ部分&lt;/p&gt;
	&lt;/div&gt;
	&lt;!-- メニュー部分 --&gt;
	&lt;div class="drawer-menu-panels" id="drawer-menu" &gt;
		&lt;div class="drawer-menu-panel" name="panel_main" &gt;
			&lt;p&gt;メインメニュー&lt/p&gt;
			&lt;input type="button" onclick="$.drawer_menu.close()" value="メニューを閉じる" /&gt;
			&lt;input type="button" onclick="$.drawer_menu.open('#drawer-menu-sub01')" value="サブメニュー1" /&gt;
			&lt;input type="button" data-drawer_menu-open='[name="panel_01"]' value="data 要素の関連付けでサブメニューを開く" /&gt;
		&lt;/div&gt;
		&lt;div class="drawer-menu-panel" name="panel_01" id="drawer-menu-sub01"&gt;
			&lt;p&gt;サブメニュー1&lt;/p&gt;
			&lt;input type="button" onclick="$.drawer_menu.close()" value="メニューを閉じる" /&gt;
		&lt;/div&gt;
		&lt;div class="drawer-menu-panel" name="panel_02" &gt;
			&lt;p&gt;サブメニュー2&lt;/p&gt;
			&lt;input type="button" onclick="$.drawer_menu.child()" value="サブメニュー2を閉じる" /&gt;
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;script type="text/javascript" src="/jquery.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="/jquery.drawer-menu.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
	$(document).ready(function(){
		$('.drawer-menu-panels').drawer_menu();
	});
&lt;/script&gt;
</code></pre>

----------

# drawer_menu の関数
drawer\_menu jQuery プラグインでは `$(expr).drawer\_menu` と `$.drawer\_menu` と `data-drawer\_menu` で使用できる関数を用意しています。必要に応じて使い分けてください。

## 引数 : expr
下記関数で expr が引数として用意されているものは、jQuery selecter で要素の指定ができます。指定する要素については各関数を参照してください。

## 引数 : callback
下記関数で callback が引数として用意されているものは callback を指定できます。callback はアニメーションが終了した際に呼び出されます。第一引数には、ドロワーメニューとして指定した `expr` が入ります。


# $(expr).drawer_menu の関数
* $(expr).drawer_menu(options)
* $(expr).drawer_menu("open", callback)
* $(expr).drawer_menu("close", callback)
* $(expr).drawer_menu("toggle", callback)

# $(expr).drawer_menu(options)
メニューをドロワーメニューとして使用できるように初期化します。戻り値は `$(expr)` になります。

## expr
ドロワーメニューとして使用したい要素1つを指定します。

## option
メニューの表示について、以下のオプションを設定できます。省略した場合は下記の値で実行されます。
<pre><code>$(".drawer-menu-panels").drawer_menu({
	body  : '.drawer-menu-body:first',
	speed : 500,
	side  : 'left',
	children : '.drawer-menu-panel',
	child_speed : 500,
	child_side : 'left',
	width : '80%',
	displace : true,
	tapToClose : '.drawer-menu-page',
	beforeOpen : function () {},
	afterOpen : function () {},
	afterOpenAnimation : function () {},
	beforeClose : function () {},
	afterClose : function () {},
	afterCloseAnimation : function () {},
});</code></pre>

### body
ページコンテンツ、メニューの親になる要素を jQuery selecter で指定します。デフォルトは<code>.drawer-menu-body:first</code>です。

### speed
メニューが表示時にかかるアニメーションの速度を指定します。デフォルトは<code>500</code>です。

### side
メニューが表示される位置を左右(<code>left</code>, <code>right</code>)で指定できます。デフォルトは<code>left</code>です。

### children
サブメニューとなる要素を jQuery selecter で指定します。
<pre><code>children : '[name^="panel"]',	// name="panel" で始まる要素
children : '.panel'	,	// CSS Class に .panel を指定した要素</code></pre>

### child_speed
サブメニューが表示時にかかるアニメーションの速度を指定します。デフォルトは<code>500</code>です。

### child_side
サブメニューが表示される位置を左右(<code>left</code>, <code>right</code>)で指定できます。デフォルトは<code>left</code>です。

### width
メニューの幅を、<code>%</code> , <code>px</code> で指定します。 デフォルトは<code>80%</code>です。

### displace
メニュー表示時にページコンテンツの位置を動かすか動かさないかを指定できます。true にするとメニュー表示時にページコンテンツも一緒に動きます。false にするとページコンテンツに重なるようにメニューが表示されます。デフォルトは<code>true</code>です。

### tapToCloce
メニュー表示時にページコンテンツをクリック(タップ)してメニューを閉じるかを設定できます。`true` , `false` もしくは jQuery selecterで指定します。`true` の場合は、メニュー以外の `body` 以下の要素クリックされた場合のみ閉じます。jQuery selecter で指定された場合は、その要素がクリックされた場合のみ閉じます。デフォルトは`.drawer-menu-page`です。

### beforeOpen, afterOpen, afterOpenAnimation, beforeClose, afterClose, afterOpenAnimation
メニューが開く前後とアニメーションが終了時、メニューが閉じる前後とアニメーション終了時、に実行する処理を指定できます。


# $(expr).drawer_menu("open", callback)
メニューもしくはサブメニューを開きます。 `expr` に指定する要素により、挙動が変わります。詳しくは下記の `expr` を参照してください。戻り値は `$(expr)` になります。

## expr
ドロワーメニューとして初期化した要素で開きたいメニュー、もしくはサブメニューを1つを指定します。

* ドロワーメニュー本体 : ドロワーメニューが開きます。サブメニューが存在する場合は、メインメニューを開きます。
* サブメニュー : サブメニューが開きます。
* ドロワーメニューもしくはサブメニューとして未登録要素を指定 : 機能しません。

# $(expr).drawer_menu("close", callback)
メニューもしくはサブメニューを開きます。 `expr` に指定する要素により、挙動が変わります。詳しくは下記の `expr` を参照してください。戻り値は `$(expr)` になります。

## expr
ドロワーメニューとして初期化した要素で閉じたいメニュー、もしくはサブメニューを1つを指定します。

* ドロワーメニュー本体 : ドロワーメニューが閉じます。
* サブメニュー : 現在開いているドロワーメニューを閉じて、expr で指定したサブメニューが閉じます。
* ドロワーメニューもしくはサブメニューとして未登録要素を指定 : 現在開いているメニューを閉じます。

# $(expr).drawer_menu("toggle", callback)
メニューもしくはサブメニューの開閉をトグルで行います。  `expr` に指定する要素により、挙動が変わります。詳しくは下記の `expr` を参照してください。戻り値は `$(expr)` になります。

## expr
ドロワーメニューとして初期化した要素でトグルで開閉したいメニュー、もしくはサブメニューを1つを指定します。

# $(expr).drawer_menu("child", callback)
サブメニューの開閉をトグルで行います。 戻り値は `$(expr)` になります。

## expr
メニューまたはサブメニューの要素1つを jQuery selecter で指定します。

* ドロワーメニュー本体 : 現在開いているサブメニューが閉じます。
* サブメニュー : 指定したサブメニューが閉じます。
* ドロワーメニューもしくはサブメニューとして未登録要素を指定 : サブメニューが開いている場合は閉じます。サブメニューが開いていない場合は機能しません。

# $.drawer_menu の関数
上記の `$(expr).drawer_menu` とほぼ同等の動きをします。戻り値は機能しない場合は `false`、それ以外は以下の文字列が帰ります。

	open = メニューを開いた。
	close = メニューを閉じた。
	child_open = サブメニューを開いた
	child_close = サブメニューを閉じた。

* $.drawer_menu.open(expr, callback)
* $.drawer_menu.close(expr, callback)
* $.drawer_menu.toggle(expr, callback)
* $.drawer_menu.child(expr, callback)

# data 要素
HTML に data 要素を指定することで、メニューボタンとして使用することができます。jQuery の live 関数の不具合により、iPhone では使用できないことが確認されております。

* data-drawer_menu-open="expr" : `$(expr).drawer_menu("open")` と同一の動作をします。
* data-drawer_menu-close="expr" : `$(expr).drawer_menu("close")` と同一の動作をします。
* data-drawer_menu-toggle="expr" : `$(expr).drawer_menu("toggle")` と同一の動作をします。
* data-drawer_menu-child="expr" : `$(expr).drawer_menu("child")` と同一の動作をします。

サブメニュー要素に対して以下の data 要素を指定すると、サブメニューを閉じた後に開くサブメニューを指定できます。

* data-drawer_menu-closeto="expr"

<code><pre>&lt;!-- メニュー部分 --&gt;
&lt;div class="drawer-menu-panels" id="drawer-menu" &gt;
	&lt;div class="drawer-menu-panel" name="panel\_main" &gt;
		&lt;p&gt;メインメニュー&lt/p&gt;
		&lt;input type="button" onclick="$.drawer\_menu.close()" value="メニューを閉じる" /&gt;
		&lt;input type="button" onclick="$.drawer\_menu.open('#drawer-menu-sub01')" value="サブメニュー1" /&gt;
		&lt;input type="button" data-drawer\_menu-open='[name="panel_01"]' value="data 要素の関連付けでサブメニューを開く" /&gt;
	&lt;/div&gt;
	&lt;div class="drawer-menu-panel" name="panel_01" id="drawer-menu-sub01"&gt;
		&lt;p&gt;サブメニュー1&lt;/p&gt;
		&lt;input type="button" onclick="$.drawer\_menu.close()" value="メニューを閉じる" /&gt;
	&lt;/div&gt;
	&lt;div class="drawer-menu-panel" name="panel_02" data-drawer\_menu-closeto='#drawer-menu-sub01' &gt;
		&lt;p&gt;サブメニュー2 閉じたらサブメニュー1が開かれる&lt;/p&gt;
		&lt;input type="button" onclick="$.drawer\_menu.child()" value="サブメニュー2を閉じる" /&gt;
	&lt;/div&gt;
&lt;/div&gt;
</pre></code>

# CSS の設定

## メニューオープン時のスタイル
メニューが開いている時は html に `data-drawer_menu-state="open"` の data 要素が追加されます。下記のように設定できます。 

### メニューオープン時にページコンテンツ部分のスクロールをさせない
<pre><code>html[data-drawer_menu-state="open"] .drawer-menu-body{
	overflow : hidden;
}
html[data-drawer_menu-state="open"] .drawer-menu-page{
	overflow : hidden;
}</code></pre>

## メニュークローズ時のスタイル
メニューが閉じている時は html に `data-drawer_menu-state="open"` の data 要素が追加されます。

## アニメーション時のスタイル
アニメーション時には html に `data-drawer_menu-state="animating"` の data 要素が追加されます。下記のように設定できます。 

### アニメーション時の横スクロールバーを消す
<pre><code>html[data-drawer_menu-state="animating"]{
	overflow-x : hidden;
}
html[data-drawer_menu-state="animating"] .drawer-menu-panels{
	overflow : hidden;
}
</code></pre>

## その他設定例
スマートフォンでは、`overflow : auto`は使用できません。Android2.3 では `position : fixed` は使用できません。「メニューを開いたままページコンテンツをスクロールさせる」 CSS設定例は PC 向けの設定になります。 

### メニューを開いたまま、ページコンテンツをスクロールさせる (position : fixed 使用)

<pre><code>html[data-drawer_menu-state="open"]{
	overflow-x : hidden;
}
html[data-drawer_menu-state="open"] .drawer-menu-page{
	overflow-x : hidden;
}
.drawer-menu-panels{
	position : fixed;
}
</code></pre>

### メニューを開いたまま、ページコンテンツをスクロールさせる (position : absolute 使用,サイズは%指定の場合)
全体の大きさからメニューからの大きさを引いたサイズに`afterOpenAnimation`を使って変更しています。 `position : fixed` を使ったときのようなサイズにしたい場合は、そのひとつ下の `div`　などの大きさを 100% 以上にします。 `beforeClose` で元に戻します。

<pre><code>&lt;style&gt;
html[data-drawer_menu-state="open"] .drawer-menu-page{
	overflow-x : hidden;
	overflow-y : auto;
}
&lt;/style&gt;


&lt;body class="drawer-menu-body"&gt;
	&lt;div class="drawer-menu-page"&gt;
		&lt;div&gt;
			&lt;p&gt;
				&lt;input type="button" onclick="$('#drawer-menu').drawer_menu.toggle()" value="メニュー" /&gt;
			&lt;/p&gt;
			&lt;p&gt;ページコンテンツ部分&lt;/p&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	&lt;!-- メニュー部分 --&gt;
	&lt;div class="drawer-menu-panels" id="drawer-menu" &gt;
		&lt;div class="drawer-menu-panel" name="panel_main" &gt;
			&lt;p&gt;メインメニュー&lt/p&gt;
			&lt;input type="button" onclick="$.drawer_menu.close()" value="メニューを閉じる" /&gt;
			&lt;input type="button" onclick="$.drawer_menu.open('#drawer-menu-sub01')" value="サブメニュー1" /&gt;
			&lt;input type="button" data-drawer_menu-open='[name="panel_01"]' value="data 要素の関連付けでサブメニューを開く" /&gt;
		&lt;/div&gt;
	&lt;/div&gt;

&lt;/body&gt;

&lt;script&gt;
	$('#drawer-menu').drawer_menu({
		afterOpenAnimation : function(){
			$('.drawer-menu-page').css({ 'width' : '20%' });
			$('.drawer-menu-page > div').css({ 'width' : '180%' });
		},
		beforeClose : function(){
			$('.drawer-menu-page').css({ 'width' : '100%' });
			$('.drawer-menu-page > div').css({ 'width' : '100%' });
		},
	});
&lt;/script&gt;
</code></pre>

### メニューを開いたまま、ページコンテンツをスクロールさせる (position : absolute 使用,サイズはpx指定の場合)
ウィンドウ全体の大きさからメニューからの大きさを引いたサイズに`afterOpenAnimation`を使って変更しています。 `position : fixed` を使ったときのようなサイズにしたい場合は、そのひとつ下の `div`　などの大きさをウィンドウサイズにします。これではリサイズ時に大きさが変わらなくなるので、window resize イベントに要素のサイズを変更する処理を登録します。 `beforeClose` で元に戻します。
window resize イベントは連続で行うと処理が重くなるのでご注意ください。

<pre><code>&lt;style&gt;
html[data-drawer_menu-state="open"] .drawer-menu-page{
	overflow-x : hidden;
	overflow-y : auto;
}
&lt;/style&gt;

&lt;body class="drawer-menu-body"&gt;
	&lt;div class="drawer-menu-page"&gt;
		&lt;div&gt;
			&lt;p&gt;
				&lt;input type="button" onclick="$('#drawer-menu').drawer_menu.toggle()" value="メニュー" /&gt;
			&lt;/p&gt;
			&lt;p&gt;ページコンテンツ部分&lt;/p&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	&lt;!-- メニュー部分 --&gt;
	&lt;div class="drawer-menu-panels" id="drawer-menu" &gt;
		&lt;div class="drawer-menu-panel" name="panel_main" &gt;
			&lt;p&gt;メインメニュー&lt/p&gt;
			&lt;input type="button" onclick="$.drawer_menu.close()" value="メニューを閉じる" /&gt;
			&lt;input type="button" onclick="$.drawer_menu.open('#drawer-menu-sub01')" value="サブメニュー1" /&gt;
			&lt;input type="button" data-drawer_menu-open='[name="panel_01"]' value="data 要素の関連付けでサブメニューを開く" /&gt;
		&lt;/div&gt;
	&lt;/div&gt;

&lt;/body&gt;

&lt;script&gt;
	$('.drawer-menu-panels').drawer_menu({
		width : '200px',
		afterOpenAnimation : afterOpenAnimation,
		beforeClose : function(){
			$('.drawer-menu-page').css({ 'width' : '100%' });
			$('.drawer-menu-page > div').css({ 'width' : '100%' });
			$(window).off('resize', resizeTo);
		},
	});

	var timer = null;
	function resizeTo() {
		if (timer !== false) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			afterOpenAnimation();
		}, 200);
	}
	function afterOpenAnimation(){
		var width = $('body').outerWidth();
		$('.drawer-menu-page').css({ 'width' : width - 200 });
		$('.drawer-menu-page > div').css({ 'width' : width });
		$(window).on('resize', resizeTo);
	}
&lt;/script&gt;
</code></pre>