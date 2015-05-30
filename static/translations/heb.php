<?php

	class HebrewTranslator{
		
		public function __construct(){
			$this->translator = array();
			$this->translator['page_titles']         =  $this->getPageTitles();
			$this->translator['common']              =  $this->getCommonText();
			$this->translator['categories']          =  $this->getCategories();
			$this->translator['modals_headers']      =  $this->getModalsHeaders();
			$this->translator['sub_tabs']            =  $this->getSubTabsTitles();
			$this->translator['actions_text']        =  $this->getActionsText();
		}
		
		private function getCommonText(){
			$common_text = array();
			//$common_text['first_name'] = '';
			$common_text['first_name'] = 'שם פרטי';
			$common_text['last_name'] = 'שם משפחה';
			$common_text['email'] = 'אי מייל';
			$common_text['address'] = 'כתובת';
			$common_text['phone'] = 'טלפון';
			$common_text['mobile_phone'] = 'נייד';
			$common_text['gender'] = 'מין';
			$common_text['member_since'] = 'הצטרף בתאריך';
			$common_text['creation_date'] = 'תאריך יצירה';
			$common_text['city'] = 'עיר';
			$common_text['status'] = 'סטטוס';
			$common_text['actions'] = 'פעולות';
			$common_text['realizations'] = 'מימושים';
			$common_text['interests'] = 'תחומי עניין';
			$common_text['push'] = 'הודעות פוש';
			$common_text['company_name'] = 'שם העסק';
			$common_text['package'] = 'חבילה';
			$common_text['title'] = 'שם';
			$common_text['close'] = 'סגור';
			$common_text['save_changes'] = 'שמור שינויים';
			$common_text['save'] = 'שמור';
			$common_text['privately_held'] = 'מספר ח.פ';
			$common_text['value'] = 'ערך';
			$common_text['used'] = 'מומש';
			$common_text['coupon_name'] = 'שם הקופון';
			$common_text['search'] = 'חיפוש';
			$common_text['filters'] = 'פילטרים';
			$common_text['active'] = 'פעיל';
			$common_text['all'] = 'הכל';
			$common_text['male'] = 'זכר';
			$common_text['female'] = 'נקבה';
			$common_text['sort_by_last'] = 'מיון לפי אחרונים';
			$common_text['sort_by_first'] = 'מיון לפי ראשונים';
			$common_text['gold'] = 'זהב';
			$common_text['silver'] = 'כסף';
			$common_text['bronze'] = 'ארד';
			$common_text['date'] = 'תאריך';

			$common_text['click_action'] = 'הקלקה';
            $common_text['click'] = 'קליק';
            $common_text['click_value'] = 'מחיר הקלקה';
            $common_text['image_width'] = 'רוחב תמונה';
            $common_text['image_height'] = 'גובה תמונה';
            $common_text['spend_limit'] = 'השקעה';
            $common_text['show_sizes'] = 'ראה גדלים';

            $common_text['packages'] = 'חבילות';
            $common_text['package_limit'] = 'תקציב החבילה';
            $common_text['campaign_title'] = 'שם הקמפיין';
            $common_text['provision'] = 'הרשאה';
            //$common_text['first_name'] = '';
            //$common_text['first_name'] = '';
			
			return $common_text;
			
			
		}
		
		private function getSubTabsTitles(){
			$subTabsTitles = array();
			$subTabsTitles['categories_list'] = 'רשימת תחומי העניין';
			$subTabsTitles['categories_statistics'] = 'סטטיסטיקות';
			return $subTabsTitles;
			
		}
		
		private function getPageTitles(){
			$pageTitles = array();
			$pageTitles['users'] = 'משתמשים';
			$pageTitles['categories'] = 'תחומי עניין';
			$pageTitles['companies'] = 'עסקים';
			$pageTitles['admin'] = 'משתמשי על';
			$pageTitles['statistics'] = 'סטטיסטיקות';
            $pageTitles['manage_campaigns'] = 'ניהול קמפיינים';
			return $pageTitles;
		}
		
		private function getActionsText(){
			$actionsText = array();
			$actionsText['add_new_company'] = 'עסק חדש';
			$actionsText['add_new_category'] = 'תחום עניין חדש';
			$actionsText['add_new_campaign'] = 'קמפיין חדש';
			$actionsText['add_new_user'] = 'משתמש חדש';
			$actionsText['add_new_campaign_type'] = 'הוסף סוג קמפיין חדש';
			//$actionsText['statistics'] = 'סטטיסטיקות';
			return $actionsText;
		}
		
		private function getCategories(){
			$categoreies = array();
			$categoreies['sport'] = 'ספורט';
			$categoreies['movies'] = 'סרטים';
			$categoreies['vacation'] = 'חופשות';
			$categoreies['space'] = 'טיולים בחלל';
			$categoreies['tourism'] = 'תיירות';
			$categoreies['marketing'] = 'מסחר';
			$categoreies['fashion'] = 'אופנה';
			return $categoreies;
			
			
		}
		
		private function getModalsHeaders(){
			$modalsHeaders = array();
			$modalsHeaders['add_new_company'] = 'הוספת עסק חדש';
			$modalsHeaders['add_new_category'] = 'הוספת תחום עניין חדש';
			return $modalsHeaders;
			
		}
		
		private function getTableHeaders(){
			$tableHeaders = array();
			$tableHeaders['first_name'] = 'משתמשים';
			$tableHeaders['last_name'] = 'משתמשים';
			$tableHeaders['email'] = 'משתמשים';
			$tableHeaders['address'] = 'משתמשים';
			$tableHeaders['phone'] = 'משתמשים';
			$tableHeaders['mobile_phone'] = 'משתמשים';
			$tableHeaders['gender'] = 'משתמשים';
			$tableHeaders['member_since'] = 'משתמשים';
			$tableHeaders['creation_date'] = 'משתמשים';
			$tableHeaders['city'] = 'משתמשים';
			$tableHeaders['status'] = 'משתמשים';
			
			
			
			
		}
		
		
		
		
	}
?>
